import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventResult, EventResultList, EventState, isHigherRank, PontozoException } from '@pontozo/common'
import { In, IsNull, LessThan } from 'typeorm'
import Category from '../../typeorm/entities/Category'
import Criterion from '../../typeorm/entities/Criterion'
import { RatingResult } from '../../typeorm/entities/RatingResult'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { currentSeasonFilter } from '../../util/currentSeasonFilter'
import { handleException } from '../../util/handleException'
import { parseRatingResultsWithChildren } from '../../util/parseRatingResults'
import { PontozoResponse } from '../../util/pontozoResponse'

export const getEventResults = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventResultList>> => {
  try {
    const seasonId = req.query.get('seasonId')
    const nationalOnly = req.query.get('nationalOnly') === 'true'
    const includeTotal = req.query.get('includeTotal') === 'true'
    const categoryIds =
      req.query
        .get('categoryIds')
        ?.split(',')
        ?.map((s) => parseInt(s))
        .filter((n) => !isNaN(n)) ?? []
    const criterionIds =
      req.query
        .get('criterionIds')
        ?.split(',')
        ?.map((s) => parseInt(s))
        .filter((n) => !isNaN(n)) ?? []

    let season: Season | null
    const ads = await getAppDataSource(context)
    const seasonRepo = ads.getRepository(Season)
    const categoryRepo = ads.getRepository(Category)
    const criterionRepo = ads.getRepository(Criterion)
    const resultsRepo = ads.getRepository(RatingResult)

    if (seasonId) {
      season = await seasonRepo.findOne({ where: { id: parseInt(seasonId) }, relations: { events: { stages: true } } })
    } else {
      season = await seasonRepo.findOne({ where: currentSeasonFilter, relations: { events: { stages: true } } })
      if (!season) {
        season = await seasonRepo.findOne({
          where: { endDate: LessThan(new Date()) },
          order: { endDate: 'DESC' },
          relations: { events: { stages: true } },
        })
      }
    }
    if (!season) {
      throw new PontozoException('Nem található a szezon!', 404)
    }

    const categoriesQuery = categoryRepo.find({ where: { id: In(categoryIds) } })
    const criteriaQuery = criterionRepo.find({ where: { id: In(criterionIds) } })
    const [categories, criteria] = await Promise.all([categoriesQuery, criteriaQuery])
    const filteredEvents = season.events.filter(
      (e) => e.state === EventState.RESULTS_READY && (!nationalOnly || isHigherRank(e)) && e.totalRatingCount > 0
    )

    const results = await resultsRepo.find({
      where: [
        { categoryId: In(categories.map((c) => c.id)), eventId: In(filteredEvents.map((e) => e.id)) },
        { criterionId: In(criteria.map((c) => c.id)), eventId: In(filteredEvents.map((e) => e.id)) },
        includeTotal ? { categoryId: IsNull(), criterionId: IsNull() } : {},
      ],
      relations: { children: { children: true } },
    })
    const eventResults: EventResult[] = filteredEvents
      .map((e) => ({
        eventId: e.id,
        eventName: e.name,
        startDate: e.startDate,
        results: results.filter((r) => r.eventId === e.id && !r.stageId).map(parseRatingResultsWithChildren),
        stages: e.stages.map((s) => ({
          stageId: s.id,
          stageName: s.name,
          results: results.filter((r) => r.eventId === e.id && r.stageId === s.id).map(parseRatingResultsWithChildren),
        })),
      }))
      .sort((e1, e2) => e1.startDate.localeCompare(e2.startDate))
    const { events, ...rawSeason } = season

    return {
      jsonBody: {
        season: rawSeason,
        categories,
        criteria: criteria.map((c) => ({ ...c, roles: JSON.parse(c.roles) })),
        eventResults,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-getEventResults', {
  methods: ['GET'],
  route: 'results',
  handler: getEventResults,
})

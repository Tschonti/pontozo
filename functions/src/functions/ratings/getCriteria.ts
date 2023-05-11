import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import Season from '../../typeorm/entities/Season'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { CategoryToRate } from './types/categoryToRate'
import { CriterionToRate } from './types/criterionToRate.dto'

export const getCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)
  const stageIdParam = req.query.get('stageId')
  let stageId = -1
  if (stageIdParam !== null) {
    stageId = parseInt(stageIdParam)
  }
  const categoryIdx = parseInt(req.query.get('categoryIdx'))

  if (isNaN(ratingId) || isNaN(stageId) || isNaN(categoryIdx) || categoryIdx < 0) {
    return {
      status: 400,
      body: 'Invalid ID'
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  const ads = await getAppDataSource()
  const ratingRepo = ads.getRepository(EventRating)
  const seasonRepo = ads.getRepository(Season)
  const stcRepo = ads.getRepository(SeasonToCategory)

  const eventRating = await ratingRepo.findOne({ where: { id: ratingId }, relations: { ratings: true } })
  if (eventRating === null) {
    return {
      status: 404,
      body: 'Rating not found!'
    }
  }
  if (eventRating.userId !== userServiceRes.data.szemely_id) {
    return {
      status: 403,
      body: "You're not allowed to get criteria for this rating"
    }
  }
  const { data: event, isError, message, status } = await getOneEvent(eventRating.eventId)
  if (isError) {
    return {
      status,
      body: message
    }
  }

  if (stageId > -1) {
    const stage = event.programok.find((p) => p.program_id === stageId)
    if (!stage || !stageFilter(stage)) {
      return {
        status: 404,
        body: 'Stage not found or not rateable!'
      }
    }
  }

  const season = await seasonRepo.findOne({
    where: { startDate: LessThanOrEqual(new Date()), endDate: MoreThanOrEqual(new Date()) }
  })

  if (season === null) {
    return {
      status: 400,
      body: 'Jelenleg nincs értékelési szezon!'
    }
  }

  const stc = await stcRepo.findOne({
    where: { season: { id: season.id }, order: categoryIdx },
    relations: { category: { criteria: { criterion: true } } }
  })
  if (stc === null) {
    return {
      status: 404,
      body: 'Category not found!'
    }
  }

  const category: CategoryToRate = {
    ...stc.category,
    criteria: stc.category.criteria
      .sort((ctc1, ctc2) => ctc1.order - ctc2.order)
      .map(({ criterion }) => ({ ...criterion, roles: JSON.parse(criterion.roles) } as Criterion))
      .filter((c) => c.roles.includes(eventRating.role) && c.stageSpecific === stageId > 0 && (event.pontozoOrszagos || !c.nationalOnly))
      .map((criterion) => {
        const rating = eventRating.ratings.find((r) => r.criterionId === criterion.id && r.stageId === stageId)
        return {
          ...criterion,
          rating
        } as CriterionToRate
      })
  }

  return {
    jsonBody: category
  }
}

app.http('ratings-getCriteria', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: getCriteria
})

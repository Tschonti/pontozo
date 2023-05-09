import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import EventRating from '../../typeorm/entities/EventRating'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { CriterionToRate } from './types/criterionToRate.dto'
import { StageToRate } from './types/stageToRate'

export const getStageCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)
  const stageId = parseInt(req.params.stageId)
  if (isNaN(ratingId) || isNaN(stageId)) {
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

  const rating = await ratingRepo.findOneBy({ id: ratingId })
  if (rating === null) {
    return {
      status: 404,
      body: 'Rating not found!'
    }
  }
  if (rating.userId !== userServiceRes.data.szemely_id) {
    return {
      status: 403,
      body: "You're not allowed to get the criteria of this rating"
    }
  }
  const { data: event, isError, message, status } = await getOneEvent(rating.eventId)
  if (isError) {
    return {
      status,
      body: message
    }
  }
  const stage = event.programok.find((p) => p.program_id === stageId)
  if (!stage || !stageFilter(stage)) {
    return {
      status: 404,
      body: 'Stage not found or not rateable!'
    }
  }

  const season = await seasonRepo.findOne({
    where: { startDate: LessThanOrEqual(new Date()), endDate: MoreThanOrEqual(new Date()) },
    relations: { categories: { category: { criteria: { criterion: { ratings: { eventRating: true } } } } } } // TODO ez nagyon inefficient
  })

  if (season === null) {
    return {
      status: 400,
      body: 'Jelenleg nincs értékelési szezon!'
    }
  }
  const categories = season.categories
    .sort((stc1, stc2) => stc1.order - stc2.order)
    .map((stc) => ({
      ...stc.category,
      criteria: stc.category.criteria
        .sort((ctc1, ctc2) => ctc1.order - ctc2.order)
        .map((ctc) => {
          const { ratings, ...c } = ctc.criterion
          const rating = ratings.find((r) => r.eventRating.id === ratingId)
          return {
            ...c,
            roles: JSON.parse(c.roles as unknown as string),
            rating
          } as CriterionToRate
        })
        .filter((c) => c.roles.includes(rating.role) && c.stageSpecific && (event.pontozoOrszagos || !c.nationalOnly))
    }))

  const avalStages = event.programok.filter(stageFilter)
  const idx = avalStages.indexOf(stage)

  return {
    jsonBody: {
      ...rating,
      categoriesWithCriteria: categories,
      eventName: event.nev_1,
      eventId: event.esemeny_id,
      stage,
      stageIdx: idx,
      stageCount: avalStages.length,
      nextStageId: avalStages.at(idx + 1)?.program_id,
      prevStageId: idx - 1 >= 0 ? avalStages.at(idx - 1)?.program_id : undefined
    } as StageToRate
  }
}

app.http('ratings-getStageCriteria', {
  methods: ['GET'],
  route: 'ratings/{id}/stage/{stageId}',
  handler: getStageCriteria
})

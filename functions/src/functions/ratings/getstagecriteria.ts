import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
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
  const ads = await getAppDataSource()
  const ratingRepo = ads.getRepository(EventRating)
  const criterionRepo = ads.getRepository(Criterion)

  const rating = await ratingRepo.findOneBy({ id: ratingId })
  if (rating === null) {
    return {
      status: 404,
      body: 'Rating not found!'
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
  const criteriaFilter = event.pontozoOrszagos ? undefined : { nationalOnly: false }
  const criteria = await criterionRepo.find({
    relations: { ratings: { eventRating: true } },
    where: { stageSpecific: true, ...criteriaFilter }
  })

  const stageCriteria = criteria
    .map(({ ratings, ...c }) => {
      const rating = ratings.find((r) => r.eventRating.id === ratingId && r.stageId === stageId)
      return {
        ...c,
        roles: JSON.parse(c.roles as unknown as string),
        rating
      } as CriterionToRate
    })
    .filter((c) => c.roles.includes(rating.role))
  const avalStages = event.programok.filter(stageFilter)
  const idx = avalStages.indexOf(stage)

  return {
    jsonBody: {
      ...rating,
      stageCriteria,
      eventName: event.nev_1,
      eventId: event.esemeny_id,
      stage,
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

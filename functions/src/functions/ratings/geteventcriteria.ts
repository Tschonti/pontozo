import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResServiceRes } from '../../util/httpRes'
import { CriterionToRate } from './types/criterionToRate.dto'
import { EventToRate } from './types/eventToRate.dto'

export const getEventCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)
  if (isNaN(ratingId)) {
    return {
      status: 400,
      body: 'Invalid rating ID'
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResServiceRes(userServiceRes)
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
  const criteriaFilter = event.pontozoOrszagos ? undefined : { nationalOnly: false }
  const criteria = await criterionRepo.find({
    relations: { ratings: { eventRating: true } },
    where: { stageSpecific: false, ...criteriaFilter }
  })

  const eventCriteria = criteria
    .map(({ ratings, ...c }) => {
      const rating = ratings.find((r) => r.eventRating.id === ratingId)
      return {
        ...c,
        roles: JSON.parse(c.roles as unknown as string),
        rating
      } as CriterionToRate
    })
    .filter((c) => c.roles.includes(rating.role))
  const avalStages = event.programok.filter(stageFilter)
  return {
    jsonBody: {
      ...rating,
      eventCriteria,
      eventName: event.nev_1,
      eventId: event.esemeny_id,
      nextStageId: avalStages?.at(0)?.program_id
    } as EventToRate
  }
}

app.http('ratings-getEventCriteria', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: getEventCriteria
})

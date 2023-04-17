import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getOneEvent, stageFilter } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
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
  const event = await getOneEvent(rating.eventId)
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
        rating: rating
          ? {
              id: rating.id,
              value: rating.value
            }
          : undefined
      } as CriterionToRate
    })
    .filter((c) => c.roles.includes(rating.role))
  return {
    jsonBody: {
      ...rating,
      eventCriteria,
      eventName: event.nev_1,
      eventId: event.esemeny_id,
      stages: event.programok.filter(stageFilter)
    } as EventToRate
  }
}

app.http('ratings-geteventcriteria', {
  methods: ['GET'],
  route: 'ratings/{id}',
  handler: getEventCriteria
})

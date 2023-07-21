import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import { isHigherRankDB } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { CategoryWithCriteria, EventRatingInfo } from '@pontozo/types'

/**
 * Called after the users starts the rating of an event to get all the rating categories and criteria.
 */
export const getEventInfo = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)

  if (isNaN(ratingId)) {
    return {
      status: 400,
      body: 'Invalid rating ID',
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
  const eventRatingAndEvent = await ratingRepo.findOne({
    where: { id: ratingId },
    relations: { event: { stages: true, season: { categories: { category: { criteria: { criterion: true } } } } } },
  })
  const { event, ...eventRating } = eventRatingAndEvent
  const { season } = event

  if (eventRating === null) {
    return {
      status: 404,
      body: 'Rating not found!',
    }
  }
  if (eventRating.userId !== userServiceRes.data.szemely_id) {
    return {
      status: 403,
      body: "You're not allowed to get criteria for this rating",
    }
  }

  const eventCategories: CategoryWithCriteria[] = []
  const stageCategories: CategoryWithCriteria[] = []

  season.categories
    .sort((stc1, stc2) => stc1.order - stc2.order)
    .forEach((stc) => {
      const filteredCriteria = stc.category.criteria
        .sort((ctc1, ctc2) => ctc1.order - ctc2.order)
        .map(({ criterion }) => {
          return {
            ...criterion,
            roles: JSON.parse(criterion.roles),
          } as Criterion
        })
        .filter((c) => c.roles.includes(eventRating.role) && (isHigherRankDB(event) || !c.nationalOnly))
      const eventCriteria = []
      const stageCriteria = []
      filteredCriteria.forEach((c) => {
        if (c.stageSpecific) {
          stageCriteria.push(c)
        } else {
          eventCriteria.push(c)
        }
      })
      if (stageCriteria.length > 0) {
        stageCategories.push({
          ...stc.category,
          criteria: stageCriteria,
        })
      }
      if (eventCriteria.length > 0) {
        eventCategories.push({
          ...stc.category,
          criteria: eventCriteria,
        })
      }
    })

  return {
    jsonBody: {
      ...eventRating,
      eventName: event.name,
      stages: event.stages,
      eventCategories,
      stageCategories,
    } as EventRatingInfo,
  }
}

app.http('ratings-getEventInfo', {
  methods: ['GET'],
  route: 'ratings/{id}/info',
  handler: getEventInfo,
})

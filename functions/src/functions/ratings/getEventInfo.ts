import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter, stageProjection } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { CategoryWithCriteria } from './types/categoryWithCriteria'
import { EventRatingInfo } from './types/eventRatingInfo'

export const getEventInfo = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)

  if (isNaN(ratingId)) {
    return {
      status: 400,
      body: 'Invalid rating ID'
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  const ads = await getAppDataSource()
  const ratingRepo = ads.getRepository(EventRating)
  const seasonRepo = ads.getRepository(Season)

  const seasonQuery = seasonRepo.findOne({
    where: { startDate: LessThanOrEqual(new Date()), endDate: MoreThanOrEqual(new Date()) },
    relations: { categories: { category: { criteria: { criterion: true } } } }
  })
  const eventRating = await ratingRepo.findOne({ where: { id: ratingId } })

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

  const season = await seasonQuery
  if (season === null) {
    return {
      status: 400,
      body: 'Jelenleg nincs értékelési szezon!'
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
            roles: JSON.parse(criterion.roles as unknown as string)
          } as Criterion
        })
        .filter((c) => c.roles.includes(eventRating.role) && (event.pontozoOrszagos || !c.nationalOnly))
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
          criteria: stageCriteria
        })
      }
      if (eventCriteria.length > 0) {
        eventCategories.push({
          ...stc.category,
          criteria: eventCriteria
        })
      }
    })

  return {
    jsonBody: {
      ...eventRating,
      eventName: event.nev_1,
      stages: event.programok.filter(stageFilter).map(stageProjection),
      eventCategories,
      stageCategories
    } as EventRatingInfo
  }
}

app.http('ratings-getEventInfo', {
  methods: ['GET'],
  route: 'ratings/{id}/info',
  handler: getEventInfo
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { getOneEvent, stageFilter, stageProjection } from '../../service/mtfsz.service'
import Criterion from '../../typeorm/entities/Criterion'
import EventRating from '../../typeorm/entities/EventRating'
import Season from '../../typeorm/entities/Season'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
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
  let eventCategoryCount = 0
  let stageCategoryCount = 0

  season.categories.forEach((stc) => {
    const filteredCriteria = stc.category.criteria
      .map(({ criterion }) => {
        return {
          ...criterion,
          roles: JSON.parse(criterion.roles as unknown as string)
        } as Criterion
      })
      .filter((c) => c.roles.includes(eventRating.role) && (event.pontozoOrszagos || !c.nationalOnly))
    let eventCriteria = 0
    let stageCriteria = 0
    filteredCriteria.forEach((c) => {
      if (c.stageSpecific) {
        stageCriteria++
      } else {
        eventCriteria++
      }
    })
    if (stageCriteria > 0) {
      stageCategoryCount++
    }
    if (eventCriteria > 0) {
      eventCategoryCount++
    }
  })

  return {
    jsonBody: {
      ...eventRating,
      eventName: event.nev_1,
      stages: event.programok.filter(stageFilter).map(stageProjection),
      eventCategoryCount: eventCategoryCount,
      stageCategoryCount: stageCategoryCount
    } as EventRatingInfo
  }
}

app.http('ratings-getEventInfo', {
  methods: ['GET'],
  route: 'ratings/{id}/info',
  handler: getEventInfo
})

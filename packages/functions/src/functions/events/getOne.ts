import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { EventWithRating } from './types/EventWithRating.dto'

/**
 * Called when the user visits an event page to get the event data and the user's rating.
 */
export const getOneEvent = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const eventId = parseInt(req.params.eventId)

  if (isNaN(eventId)) {
    return {
      status: 400,
      body: 'Invalid ID'
    }
  }

  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }

  try {
    const ads = await getAppDataSource()
    const eventQuery = ads.getRepository(Event).findOne({ where: { id: eventId }, relations: { organisers: true, stages: true } })
    const userRatingQuery = ads.getRepository(EventRating).findOne({ where: { eventId: eventId, userId: userServiceRes.data.szemely_id } })
    const [event, userRating] = await Promise.all([eventQuery, userRatingQuery])
    return {
      jsonBody: {
        event,
        userRating
      } as EventWithRating
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      jsonBody: e
    }
  }
}

app.http('events-getOne', {
  methods: ['GET'],
  route: 'events/getOne/{eventId}',
  handler: getOneEvent
})

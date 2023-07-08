import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'

/**
 * Called when a user visits an events page to get their rating of that event.
 */
export const getEventRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

  const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
  const eventRating = await ratingRepo.findOne({ where: { eventId, userId: userServiceRes.data.szemely_id } })
  return {
    jsonBody: {
      rating: eventRating
    }
  }
}

app.http('ratings-getEventRating', {
  methods: ['GET'],
  route: 'ratings/event/{eventId}',
  handler: getEventRating
})

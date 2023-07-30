import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called when the user visits their profile to get all the events they've rated
 */
export const getRatedEvents = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)
    const eventRatings = await (await getAppDataSource())
      .getRepository(EventRating)
      .find({ where: { userId: user.szemely_id }, relations: { event: { organisers: true } } })

    return {
      jsonBody: eventRatings,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('events-ratedByUser', {
  methods: ['GET'],
  route: 'events/ratedByUser',
  handler: getRatedEvents,
})

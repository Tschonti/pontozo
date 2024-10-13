import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

/**
 * Called when a user visits an events page to get their rating of that event and also the event data.
 */
export const getEventRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const eventId = validateId(req)

    const user = getUserFromHeader(req)
    const ratingRepo = (await getAppDataSource(context)).getRepository(EventRating)
    const eventRating = await ratingRepo.findOne({
      where: { eventId, userId: user.szemely_id },
      relations: { event: { organisers: true, stages: true } },
    })
    return {
      jsonBody: eventRating,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-getEventRating', {
  methods: ['GET'],
  route: 'ratings/event/{id}',
  handler: getEventRating,
})

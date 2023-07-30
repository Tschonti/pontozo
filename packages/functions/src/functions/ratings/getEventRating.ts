import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '../../../../common/src'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called when a user visits an events page to get their rating of that event and also the event data.
 */
export const getEventRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const eventId = parseInt(req.params.eventId)
    if (isNaN(eventId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }

    const user = getUserFromHeader(req)
    const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
    const eventRating = await ratingRepo.findOne({
      where: { eventId, userId: user.szemely_id },
      relations: { event: { organisers: true, stages: true } },
    })
    return {
      jsonBody: eventRating,
    }
  } catch (error) {
    return handleException(context, error)
  }
}

app.http('ratings-getEventRating', {
  methods: ['GET'],
  route: 'ratings/event/{eventId}',
  handler: getEventRating,
})

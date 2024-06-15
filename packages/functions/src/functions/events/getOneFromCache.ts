import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventWithRating, PontozoException } from '@pontozo/common'
import { getRedisClient } from '../../redis/redisClient'
import { getUserFromHeader } from '../../service/auth.service'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'

/**
 * NOT USED
 * Called when the user visits an event page while the DB is still starting up.
 * Return the data of the event from the cache, omits the user's rating since that is not stored in the cache
 */
export const getOneEventFromCache = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventWithRating>> => {
  try {
    const eventId = parseInt(req.params.eventId)
    if (isNaN(eventId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }
    getUserFromHeader(req)

    const redisClient = await getRedisClient(context)
    const event = await redisClient.get(`event:${eventId}`)

    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    return {
      jsonBody: {
        event: JSON.parse(event),
        userRating: null,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('cached-events-getOne', {
  methods: ['GET'],
  route: 'cached/events/getOne/{eventId}',
  handler: getOneEventFromCache,
})

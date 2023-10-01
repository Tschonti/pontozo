import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getRedisClient } from '../../redis/redisClient'
import Event from '../../typeorm/entities/Event'
import { handleException } from '../../util/handleException'

/**
 * Called when the user visits the frontpage. Returns all the events that are in the cache
 */
export const getRateableEventsFromCache = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const redisClient = await getRedisClient(context)
    const keys = await redisClient.keys('event:*')
    const events: Event[] = (await Promise.all(keys.map((k) => redisClient.get(k)))).map((eventAsString) => JSON.parse(eventAsString))

    return {
      jsonBody: events,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('cached-events-rateable', {
  methods: ['GET'],
  route: 'cached/events/rateable',
  handler: getRateableEventsFromCache,
})

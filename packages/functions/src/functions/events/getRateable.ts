import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * Called when the user visits the frontpage. Returns all the events that can be rated.
 */
export const getRateableEvents = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const events = await (await getAppDataSource())
      .getRepository(Event)
      .find({ where: { rateable: true }, relations: { organisers: true } })
    return {
      jsonBody: events,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('events-rateable', {
  methods: ['GET'],
  route: 'events/rateable',
  handler: getRateableEvents,
})

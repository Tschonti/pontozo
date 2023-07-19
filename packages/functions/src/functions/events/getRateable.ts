import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'

/**
 * Called when the user visits the frontpage. Returns all the events that can be rated.
 */
export const getRateableEvents = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const events = await (await getAppDataSource())
      .getRepository(Event)
      .find({ where: { rateable: true }, relations: { organisers: true } })

    return {
      jsonBody: events
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      jsonBody: e
    }
  }
}

app.http('events-rateable', {
  methods: ['GET'],
  route: 'events/rateable',
  handler: getRateableEvents
})

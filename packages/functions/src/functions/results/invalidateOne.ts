import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { AlertLevel, EventState, PontozoException } from '@pontozo/common'
import { newAlertItem } from '../../service/alert.service'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

/**
 * A util function to invalidate the rating results of an event. It sets its state to 'INVALIDATED',
 * so the next time the closeRating orchestrator will be run, the results will be recalculated for this event as well.
 * It can't be called from the client, only manualy with an admin JWT.
 */
export const invalidateOneResult = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    const eventId = parseInt(req.params.eventId)
    const ads = await getAppDataSource(context)
    const eventRepo = ads.getRepository(Event)

    const event = await eventRepo.findOne({ where: { id: eventId } })
    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    event.state = EventState.INVALIDATED
    await eventRepo.save(event)
    await newAlertItem({
      ads,
      context,
      desc: `User:${user.szemely_id} invalidated the rating results of event:${eventId}`,
      level: AlertLevel.WARN,
    })
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-invalidate', {
  methods: ['PATCH'],
  route: 'results/{eventId}',
  handler: invalidateOneResult,
})

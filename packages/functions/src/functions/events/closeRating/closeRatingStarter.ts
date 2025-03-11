import { app, InvocationContext, Timer } from '@azure/functions'
import { AlertLevel, EventState } from '@pontozo/common'
import * as df from 'durable-functions'
import { Not } from 'typeorm'
import { newAlertItem } from '../../../service/alert.service'
import Event from '../../../typeorm/entities/Event'
import { getAppDataSource } from '../../../typeorm/getConfig'
import { orchestratorName } from './closeRatingOrchestrator'

/**
 * Called automatically every night to make events that have been rateable for more than ~8 days unrateable.
 * Then it starts the closeRating orchestration that will eventually validate and accumulate the ratings.
 */
const closeRatingStarter = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  try {
    const ads = await getAppDataSource(context)

    const eventRepo = ads.getRepository(Event)
    const eventsWithoutResults = await eventRepo.find({ where: { state: Not(EventState.RESULTS_READY) } })
    const now = new Date().getTime()
    const toArchive = eventsWithoutResults
      .filter((event) => {
        const endTimestamp = new Date(event.endDate ?? event.startDate).getTime()
        return event.state === EventState.RATEABLE && now - endTimestamp > 8 * 24 * 60 * 60 * 1000
      })
      .map((event) => ({
        ...event,
        state: EventState.VALIDATING,
      }))

    await eventRepo.save(toArchive)
    context.log(`Closed the rating session for ${toArchive.length} event(s)`)

    const toClose = [...toArchive, ...eventsWithoutResults.filter((e) => e.state !== EventState.RATEABLE)]
    if (toClose.length > 0) {
      const client = df.getClient(context)
      const instanceId = await client.startNew(orchestratorName, {
        input: { sendNotification: true, events: toClose.map((e) => ({ eventId: e.id, state: e.state })) },
      })
      context.log(`Started orchestration with ID = '${instanceId}'.`)
    }
  } catch (error) {
    await newAlertItem({ context, desc: `Error during closeRatingStarter: ${error}`, level: AlertLevel.ERROR })
  }
}

app.timer('events-close-rating', {
  schedule: '1 0 0 * * *', // 1 second after midnight, every day
  handler: closeRatingStarter,
  runOnStartup: false,
  extraInputs: [df.input.durableClient()],
})

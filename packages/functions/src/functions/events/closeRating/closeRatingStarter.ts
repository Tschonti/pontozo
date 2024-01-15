import { app, InvocationContext, Timer } from '@azure/functions'
import * as df from 'durable-functions'
import Event from '../../../typeorm/entities/Event'
import { getAppDataSource } from '../../../typeorm/getConfig'
import { orchestratorName } from './closeRatingOrchestrator'

/**
 * Called automatically every night to make events that have been rateable for more than ~8 days unrateable.
 * Also deletes them from the cache. TODO
 */
const closeRatingStarter = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  try {
    const ads = await getAppDataSource(context)

    const eventRepo = ads.getRepository(Event)
    const rateableEvents = await eventRepo.find({ where: { rateable: true } })
    const now = new Date().getTime()
    const toArchive = rateableEvents
      .filter((event) => {
        const endTimestamp = new Date(event.endDate ?? event.startDate).getTime()
        return now - endTimestamp > 8 * 24 * 60 * 60 * 1000
      })
      .map((event) => ({
        ...event,
        rateable: false,
      }))

    //await eventRepo.save(toArchive) TODO
    context.log(`Closed the rating session for ${toArchive.length} event(s)`)

    /* const redisKeysToDelete = toArchive.map((e) => `event:${e.id}`)
    let deleted = 0
    if (redisKeysToDelete.length > 0) {
      deleted = await redisClient.del(redisKeysToDelete)
    }
    if (toArchive.length !== deleted) {
      context.warn(`${toArchive.length} events archived, but ${deleted} events deleted from cache!`)
    } */

    if (toArchive.length > 0) {
      const client = df.getClient(context)
      const instanceId = await client.startNew(orchestratorName, { input: toArchive.map((e) => e.id) })
      context.log(`Started orchestration with ID = '${instanceId}'.`)
    }
  } catch (error) {
    context.log(error)
  }
}

app.timer('events-close-rating', {
  schedule: '1 0 0 * * *', // 1 second after midnight, every day
  handler: closeRatingStarter,
  runOnStartup: false,
  extraInputs: [df.input.durableClient()],
})

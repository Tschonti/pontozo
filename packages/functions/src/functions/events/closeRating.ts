import { app, InvocationContext, Timer } from '@azure/functions'
import Event from '../../typeorm/entities/Event'
import { getAppDataSource } from '../../typeorm/getConfig'

/**
 * Called automatically every night to make events that have been rateable for more than ~8 days unrateable.
 * Also deletes them from the cache.
 */
export const closeRating = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  try {
    const pads = getAppDataSource(context)
    // const predis = getRedisClient(context)
    const [ads /*redisClient*/] = await Promise.all([pads /*predis*/])

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

    await eventRepo.save(toArchive)
    // const redisKeysToDelete = toArchive.map((e) => `event:${e.id}`)
    // let deleted = 0
    // if (redisKeysToDelete.length > 0) {
    //   deleted = await redisClient.del(redisKeysToDelete)
    // }
    // if (toArchive.length !== deleted) {
    //   context.warn(`${toArchive.length} events archived, but ${deleted} events deleted from cache!`)
    // }
    context.log(`Closed the rating session for ${toArchive.length} event(s)`)
  } catch (error) {
    context.log(error)
  }
}

app.timer('events-close-rating', {
  schedule: '0 0 3 * * *', // 3 AM every day
  handler: closeRating,
  runOnStartup: false,
})

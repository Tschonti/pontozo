import { InvocationContext } from '@azure/functions'
import { AlertLevel } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource, In } from 'typeorm'
import { getRedisClient } from '../../../redis/redisClient'
import { newAlertItem } from '../../../service/alert.service'
import { DBConfig } from '../../../typeorm/configOptions'
import { RatingResult } from '../../../typeorm/entities/RatingResult'

export const deletePreviousResultsActivityName = 'deletePreviousResultsActivity'

/**
 * Durable Functions activity that deletes all the previous rating results for event whose ratings have been invalidated.
 * It deletes the entries by events to reduce the load on the DB.
 * @param eventIds list of eventIDs, whose rating result records will be deleted
 * @returns whether the operation succeeded
 */
const deletePreviousResults: ActivityHandler = async (eventIds: number[], context: InvocationContext): Promise<boolean> => {
  try {
    const ads = await new DataSource(DBConfig).initialize()
    const redisClient = await getRedisClient(context)

    const ratingResultRepo = ads.getRepository(RatingResult)
    const ratingResults = await ratingResultRepo.find({ where: { eventId: In(eventIds) } })
    if (ratingResults.length > 0) {
      const resultsGroupedByEventId = ratingResults.reduce((map, rr) => {
        if (!map[rr.eventId]) {
          map[rr.eventId] = []
        }
        map[rr.eventId].push(rr)
        return map
      }, {} as Record<number, RatingResult[]>)
      for (const eventId of Object.keys(resultsGroupedByEventId)) {
        await ratingResultRepo.delete(resultsGroupedByEventId[parseInt(eventId)].map((rr) => rr.id))
      }
    }
    await redisClient.del(eventIds.map((eId) => `ratingResult:${eId}`))
    return true
  } catch (e) {
    context.error(`Deletion of previous rating results failed: ${e}`)
    await newAlertItem({ context, desc: `Deletion of previous rating results failed!`, level: AlertLevel.ERROR })
    return false
  }
}
df.app.activity(deletePreviousResultsActivityName, { handler: deletePreviousResults })

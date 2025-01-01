import { InvocationContext } from '@azure/functions'
import { EventState, RatingStatus } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource, IsNull } from 'typeorm'
import { getRedisClient } from '../../../redis/redisClient'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'
import { RatingResult } from '../../../typeorm/entities/RatingResult'
import { parseRatingResults } from '../../../util/parseRatingResults'
import { accumulateStage, StageResult } from '../../../util/ratingAverage'
import { ActivityOutput } from './closeRatingOrchestrator'

export const calculateAvgRatingActivityName = 'calculateAvgRatingActivity'

/**
 * Durable Functions activity that calculates all the avarages of the ratings for a given event. It stores the result in the DB and in Redis.
 * @param eventId ID of the event to calculate the results for
 * @returns whether the operation succeeded and the eventId
 */
const calculateAvgRating: ActivityHandler = async (eventId: number, context: InvocationContext): Promise<ActivityOutput> => {
  try {
    const ads = new DataSource(DBConfig)
    await ads.initialize()
    const eventRepo = ads.getRepository(Event)

    const eventRatingsPrmoise = ads.getRepository(EventRating).find({
      where: { eventId, status: RatingStatus.SUBMITTED },
      relations: { ratings: true },
    })
    const eventPromise = eventRepo.findOne({
      where: { id: eventId, state: EventState.ACCUMULATING },
      relations: { season: { categories: { category: { criteria: { criterion: true } } } }, stages: true, organisers: true },
    })

    const [eventRatings, event] = await Promise.all([eventRatingsPrmoise, eventPromise])
    if (!event) {
      context.warn(`Event:${eventId} not found or is in invalid state, cancelling accumulation.`)
      return { success: false, eventId }
    }

    const categories = event.season.categories.map((stc) => ({
      ...stc.category,
      criteria: stc.category.criteria.map((ctc) => ctc.criterion),
    }))
    const categoriesWithStageCrit = categories.filter((c) => c.criteria.some((crit) => crit.stageSpecific))

    const allEvent = accumulateStage({
      eventId,
      categories,
      eventRatings,
    })
    let stages: StageResult[] = []
    if (event.stages.length > 1) {
      stages = event.stages.map((s) =>
        accumulateStage({
          eventId,
          stageId: s.id,
          categories: categoriesWithStageCrit,
          eventRatings,
        })
      )
    }
    await ads.manager.transaction(async (transactionalEntityManager) => {
      const promises = [allEvent, ...stages].map(async (sr) => {
        await transactionalEntityManager.save(sr.root)
        await transactionalEntityManager.save(sr.categories)
        await transactionalEntityManager.save(sr.criteria)
      })
      await Promise.all(promises)
      await transactionalEntityManager.getRepository(Event).update(eventId, { state: EventState.RESULTS_READY })
      event.state = EventState.RESULTS_READY
    })
    context.log(`Results of event:${event.id} saved to db.`)

    const redisClient = await getRedisClient(context)
    const results = await ads.getRepository(RatingResult).find({
      where: { eventId: eventId, parentId: IsNull() },
      relations: { children: { category: true, children: { criterion: true } } },
    })
    const { season, ...restOfEvent } = event
    const parsed = parseRatingResults(results, restOfEvent)
    await redisClient.set(`ratingResult:${event.id}`, JSON.stringify(parsed))
    context.log(`Results of event:${event.id} saved to cache.`)

    return { success: true, eventId }
  } catch (e) {
    context.error(`Error in calculate average rating activity for event:${eventId}: ${e}`)
    return { success: false, eventId }
  }
}
df.app.activity(calculateAvgRatingActivityName, { handler: calculateAvgRating })

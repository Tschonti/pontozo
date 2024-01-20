import { EventState, RatingStatus } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler, OrchestrationContext } from 'durable-functions'
import { DataSource } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'
import { accumulateStage, StageResult } from '../../../util/ratingAverage'

export const calculateAvgRatingActivityName = 'calculateAvgRatingActivity'
type CalculateAvgRatingInput = { eventId: number; context: OrchestrationContext }
export type CalculateAvgRatingOutput = { eventId: number; success: boolean }

const calculateAvgRating: ActivityHandler = async ({ context, eventId }: CalculateAvgRatingInput): Promise<CalculateAvgRatingOutput> => {
  try {
    const ads = new DataSource(DBConfig)
    await ads.initialize()
    const eventRatingsPrmoise = ads.getRepository(EventRating).find({
      where: { eventId, status: RatingStatus.SUBMITTED },
      relations: { ratings: true },
    })
    const eventPromise = ads.getRepository(Event).findOne({
      where: { id: eventId, state: EventState.ACCUMULATING },
      relations: { season: { categories: { category: { criteria: { criterion: true } } } }, stages: true },
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
    })
    return { success: true, eventId }
  } catch (e) {
    context.error(`Error in calculate average rating activity for event:${eventId}: ${e}`)
    return { success: false, eventId }
  }
}
df.app.activity(calculateAvgRatingActivityName, { handler: calculateAvgRating })

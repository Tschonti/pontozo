import { RatingStatus } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'
import { accumulateStage, StageResult } from '../../../util/ratingAverage'

export const calculateAvgRatingActivityName = 'calculateAvgRatingActivity'

const calculateAvgRating: ActivityHandler = async (eventId: number) => {
  try {
    const ads = new DataSource(DBConfig)
    await ads.initialize()
    const eventRatingsPrmoise = ads.getRepository(EventRating).find({
      where: { eventId, status: RatingStatus.SUBMITTED },
      relations: { ratings: true },
    }) // TODO
    const eventPromise = ads.getRepository(Event).findOne({
      where: { id: eventId },
      relations: { season: { categories: { category: { criteria: { criterion: true } } } }, stages: true },
    })
    const [eventRatings, event] = await Promise.all([eventRatingsPrmoise, eventPromise])
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
    const promises = [allEvent, ...stages].map(async (sr) => {
      await ads.manager.save(sr.root)
      await ads.manager.save(sr.categories)
      await ads.manager.save(sr.criteria)
    })
    await Promise.all(promises)
  } catch {
    // TODO
  }
}
df.app.activity(calculateAvgRatingActivityName, { handler: calculateAvgRating })

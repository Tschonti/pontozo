import { RatingStatus } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { DataSource } from 'typeorm'
import { DBConfig } from '../../../typeorm/configOptions'
import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'
import { RatingResult } from '../../../typeorm/entities/RatingResult'
import { accumulateCategory, averageByRoleAndGroup } from '../../../util/ratingAverage'

export const calculateAvgRatingActivityName = 'calculateAvgRatingActivity'

const calculateAvgRating: ActivityHandler = async (eventId: number) => {
  try {
    const ads = new DataSource(DBConfig)
    await ads.initialize()
    const eventRatingsPrmoise = ads.getRepository(EventRating).find({
      where: { eventId, status: RatingStatus.SUBMITTED },
      relations: {
        ratings: {
          criterion: true,
          stage: true,
        },
      },
    }) // TODO
    const eventPromise = ads
      .getRepository(Event)
      .findOne({ where: { id: eventId }, relations: { season: { categories: { category: { criteria: { criterion: true } } } } } })
    const [eventRatings, event] = await Promise.all([eventRatingsPrmoise, eventPromise])
    const categories = event.season.categories.map((stc) => ({
      ...stc.category,
      criteria: stc.category.criteria.map((ctc) => ctc.criterion),
    }))

    const root = new RatingResult()
    root.eventId = eventId

    const categoryResultEntitesAndRawData = categories.map((c) => {
      // TODO stage
      const categoryResult = new RatingResult()
      categoryResult.eventId = eventId
      categoryResult.parent = root
      categoryResult.categoryId = c.id

      const criteriaResults = c.criteria.map((crit) => ({
        eventId,
        items: averageByRoleAndGroup(eventRatings, (cr) => cr.criterionId === crit.id),
        criterionId: crit.id,
      }))
      const rawCategory = accumulateCategory(criteriaResults)
      categoryResult.items = JSON.stringify(rawCategory)
      const criteriaResultEntities: RatingResult[] = criteriaResults.map((cr) => {
        const cre = new RatingResult()
        cre.eventId = cr.eventId
        cre.criterionId = cr.criterionId
        cre.parent = categoryResult
        cre.items = JSON.stringify(cr.items)
        return cre
      })
      categoryResult.children = criteriaResultEntities
      return { entity: categoryResult, raw: rawCategory }
    })
    root.children = categoryResultEntitesAndRawData.map((cr) => cr.entity)
    root.items = JSON.stringify(
      accumulateCategory(categoryResultEntitesAndRawData.map((cr) => ({ eventId, items: cr.raw, categoryId: cr.entity.categoryId })))
    )

    await ads.manager.save(root)
    await ads.manager.save(root.children)
    await ads.manager.save(root.children.flatMap((s) => s.children))
  } catch {
    // TODO
  }
}
df.app.activity(calculateAvgRatingActivityName, { handler: calculateAvgRating })

import { ageGroupFilterDict, ALL_AGE_GROUPS, ALL_ROLES, RatingResultItem, RatingResultWithJoins } from '@pontozo/common'
import Category from '../typeorm/entities/Category'
import Criterion from '../typeorm/entities/Criterion'
import CriterionRating from '../typeorm/entities/CriterionRating'
import EventRating from '../typeorm/entities/EventRating'
import { RatingResult } from '../typeorm/entities/RatingResult'
type Average = {
  count: number
  average: number
}

export const ratingAverage = (
  ratings: EventRating[],
  erFilter: (er: EventRating) => boolean = () => true,
  crFilter: (cr: CriterionRating) => boolean = () => true
): Average => {
  const res: Average = {
    count: 0,
    average: 0,
  }
  let sum = 0
  for (const er of ratings) {
    if (erFilter(er)) {
      for (const r of er.ratings) {
        if (r.value > -1 && crFilter(r)) {
          res.count++
          sum += r.value
        }
      }
    }
  }
  if (res.count === 0) {
    res.average = -1
  } else {
    res.average = sum / res.count
  }
  return res
}

export const averageByRoleAndGroup = (
  eventRatings: EventRating[],
  crFilter: (cr: CriterionRating) => boolean = () => true
): RatingResultItem[] => [
  ratingAverage(eventRatings, () => true, crFilter),
  ...ALL_ROLES.map((role) => {
    const result: RatingResultItem = ratingAverage(eventRatings, (er) => er.role === role, crFilter)
    result.role = role
    return result
  }),
  ...ALL_AGE_GROUPS.map((ageGroup) => {
    const result: RatingResultItem = ratingAverage(eventRatings, ageGroupFilterDict[ageGroup], crFilter)
    result.ageGroup = ageGroup
    return result
  }),
]

export const accumulateCategory = (results: Omit<RatingResultWithJoins, 'id'>[]): RatingResultItem[] => {
  const variatons = ALL_ROLES.length + ALL_AGE_GROUPS.length + 1
  const zeroToN = Array.from({ length: variatons }, (_, i) => i)
  const sum = Array.from({ length: variatons }, () => 0)
  const count = Array.from({ length: variatons }, () => 0)

  results.forEach((r) => {
    zeroToN.forEach((i) => {
      sum[i] += r.items[i].average * r.items[i].count
      count[i] += r.items[i].count
    })
  })
  return zeroToN.map((i) => ({
    count: count[i],
    average: count[i] === 0 ? -1 : sum[i] / count[i],
    ageGroup: results[0].items[i].ageGroup,
    role: results[0].items[i].role,
  }))
}

type Params = {
  eventId: number
  stageId?: number
  categories: (Omit<Category, 'criteria'> & { criteria: Criterion[] })[]
  eventRatings: EventRating[]
}

export type StageResult = {
  root: RatingResult
  categories: RatingResult[]
  criteria: RatingResult[]
}

export const accumulateStage = ({ eventId, stageId, categories, eventRatings }: Params): StageResult => {
  const root = new RatingResult()
  root.eventId = eventId
  root.stageId = stageId

  const categoryResultEntitesAndRawData = categories.map((c) => {
    const categoryResult = new RatingResult()
    categoryResult.eventId = eventId
    categoryResult.parent = root
    categoryResult.categoryId = c.id
    categoryResult.stageId = stageId

    const criteriaResults = c.criteria
      .filter((c) => !stageId || c.stageSpecific)
      .map((crit) => ({
        eventId,
        items: averageByRoleAndGroup(eventRatings, (cr) => cr.criterionId === crit.id && (!stageId || cr.stageId === stageId)),
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
      cre.stageId = stageId
      return cre
    })
    categoryResult.children = criteriaResultEntities
    return { entity: categoryResult, raw: rawCategory }
  })
  root.children = categoryResultEntitesAndRawData.map((cr) => cr.entity)
  root.items = JSON.stringify(
    accumulateCategory(categoryResultEntitesAndRawData.map((cr) => ({ eventId, items: cr.raw, categoryId: cr.entity.categoryId })))
  )
  return { root, categories: root.children, criteria: root.children.flatMap((s) => s.children) }
}

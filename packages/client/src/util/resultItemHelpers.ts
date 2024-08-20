import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, EventResult, RatingResult, RatingResultItem, RatingRole } from '@pontozo/common'
import { SortOrder } from 'src/pages/results/components/table/EventResultTable'

export const getResultItem = (
  resultItems: RatingResultItem[],
  roles: RatingRole[],
  ageGroups: AgeGroup[]
): RatingResultItem | undefined => {
  if (roles.length === ALL_ROLES.length && ageGroups.length === ALL_AGE_GROUPS.length) {
    return resultItems.find((ri) => !ri.role && !ri.ageGroup)
  } else if (roles.length < ALL_ROLES.length) {
    let sum = 0
    let count = 0
    resultItems.forEach((ri) => {
      if (ri.role && roles.includes(ri.role as RatingRole)) {
        sum += ri.average * ri.count
        count += ri.count
      }
    })
    return generateResultItem(count, sum)
  } else {
    let sum = 0
    let count = 0
    resultItems.forEach((ri) => {
      if (ri.ageGroup && ageGroups.includes(ri.ageGroup as AgeGroup)) {
        sum += ri.average * ri.count
        count += ri.count
      }
    })
    return generateResultItem(count, sum)
  }
}

export const sortEvents = (
  eventResults: EventResult[],
  sortOrder: SortOrder,
  ratingResultFinder: (rr: RatingResult) => boolean,
  roles: RatingRole[],
  ageGroups: AgeGroup[]
) => {
  return [...eventResults].sort((er1, er2) => {
    const rri1 = getResultItem((er1.results.find(ratingResultFinder)?.items ?? []) as RatingResultItem[], roles, ageGroups)
    const rri2 = getResultItem((er2.results.find(ratingResultFinder)?.items ?? []) as RatingResultItem[], roles, ageGroups)
    return (sortOrder === 'desc' ? -1 : 1) * ((rri1?.average || 0) - (rri2?.average || 0))
  })
}

const generateResultItem = (count: number, sum: number): RatingResultItem => {
  if (count === 0) {
    return {
      average: -1,
      count: 0,
    }
  }
  return {
    average: sum / count,
    count: count,
  }
}

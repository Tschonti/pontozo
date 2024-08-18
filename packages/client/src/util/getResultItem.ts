import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, RatingResultItem, RatingRole } from '@pontozo/common'

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

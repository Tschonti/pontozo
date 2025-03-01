import {
  AgeGroup,
  ALL_AGE_GROUPS,
  ALL_ROLES,
  EventResult,
  PublicEventMessage,
  RatingResult,
  RatingResultItem,
  RatingResultWithChildren,
  RatingRole,
} from '@pontozo/common'
import { SortOrder } from 'src/api/contexts/ResultTableContext'

export const getScore = (roles: RatingRole[], ageGroups: AgeGroup[], result?: RatingResultWithChildren): number => {
  if (!result) return -1
  if ((roles.length === ALL_ROLES.length && ageGroups.length === ALL_AGE_GROUPS.length) || !result.items) return result.score
  if (result.criterionId) return getCriterionScore(result, roles, ageGroups)
  if (result.categoryId) return getCategoryScore(result, roles, ageGroups)
  return getRootScore(result, roles, ageGroups)
}

const getCriterionScore = (result: RatingResult, roles: RatingRole[], ageGroups: AgeGroup[]): number => {
  const aggregated = aggregateCriterionResults(roles, ageGroups, result)

  if (aggregated.compCount + aggregated.orgCount === 0) return -1
  return (
    ((aggregated.compCount > 0 ? (result.competitorWeight ?? 1) * (aggregated.compSum / aggregated.compCount) : 0) +
      (aggregated.orgCount > 0 ? (result.organiserWeight ?? 1) * (aggregated.orgSum / aggregated.orgCount) : 0)) /
    ((aggregated.compCount ? result.competitorWeight ?? 1 : 0) + (aggregated.orgCount ? result.organiserWeight ?? 1 : 0))
  )
}

const getCategoryScore = (result: RatingResultWithChildren, roles: RatingRole[], ageGroups: AgeGroup[]): number => {
  if (!result.children) return -1
  return aggregateCriteria(result.children, roles, ageGroups)
}

const getRootScore = (result: RatingResultWithChildren, roles: RatingRole[], ageGroups: AgeGroup[]): number => {
  if (!result.children) return -1
  return aggregateCriteria(
    result.children.flatMap((catRes) => catRes.children).filter((critRes) => !!critRes),
    roles,
    ageGroups
  )
}

export const sortEvents = (
  eventResults: EventResult[],
  sortOrder: SortOrder,
  ratingResultFinder: (rr: RatingResult) => boolean,
  roles: RatingRole[],
  ageGroups: AgeGroup[]
) => {
  return [...eventResults].sort((er1, er2) => {
    const rri1 = getCriterionScore(er1.results.find(ratingResultFinder) as RatingResult, roles, ageGroups)
    const rri2 = getCriterionScore(er2.results.find(ratingResultFinder) as RatingResult, roles, ageGroups)
    return (sortOrder === 'desc' ? -1 : 1) * (rri1 - rri2)
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

export const filterEventMessages = (messages: PublicEventMessage[], roles: RatingRole[], ageGroups: AgeGroup[]): PublicEventMessage[] => {
  if (roles.length === ALL_ROLES.length && ageGroups.length === ALL_AGE_GROUPS.length) {
    return messages
  } else if (roles.length < ALL_ROLES.length) {
    return messages.filter((m) => roles.includes(m.role))
  } else {
    return messages.filter((m) => ageGroups.includes(m.ageGroup))
  }
}

type AggregationByRatingGroup = {
  compCount: number
  compSum: number
  orgCount: number
  orgSum: number
  compWeight: number
  orgWeight: number
}

const aggregateCriterionResults = (roles: RatingRole[], ageGroups: AgeGroup[], ratingRes: RatingResult): AggregationByRatingGroup => ({
  ...ageGroups
    .map((ag) => {
      const [competitor, coach, organiser, jury] = ALL_ROLES.map((rr) =>
        roles.includes(rr)
          ? ratingRes.items?.find((rri) => rri.role === rr && rri.ageGroup === ag) ?? { count: 0, average: -1 }
          : { count: 0, average: -1 }
      )

      return {
        compCount: competitor.count + coach.count,
        compSum: competitor.count * competitor.average + coach.count * coach.average,
        orgCount: organiser.count + jury.count,
        orgSum: organiser.count * organiser.average + jury.count * jury.average,
      }
    })
    .reduce(
      (sum, agc) => ({
        compCount: sum.compCount + agc.compCount,
        compSum: sum.compSum + agc.compSum,
        orgCount: sum.orgCount + agc.orgCount,
        orgSum: sum.orgSum + agc.orgSum,
      }),
      { compCount: 0, compSum: 0, orgCount: 0, orgSum: 0 }
    ),
  orgWeight: ratingRes.organiserWeight ?? 1,
  compWeight: ratingRes.competitorWeight ?? 1,
})

const aggregateCriteria = (criteriaResults: RatingResult[], roles: RatingRole[], ageGroups: AgeGroup[]): number => {
  const catRes = criteriaResults
    .map((critRes) => aggregateCriterionResults(roles, ageGroups, critRes))
    .reduce(
      (runningSum, crit) => {
        const newRes = { ...runningSum }
        if (crit.compCount > 0) {
          newRes.avgSum += (crit.compSum / crit.compCount) * crit.compWeight
          newRes.weightSum += crit.compWeight
        }
        if (crit.orgCount > 0) {
          newRes.avgSum += (crit.orgSum / crit.orgCount) * crit.orgWeight
          newRes.weightSum += crit.orgWeight
        }
        return newRes
      },
      { avgSum: 0, weightSum: 0 }
    )

  return catRes.weightSum === 0 ? -1 : catRes.avgSum / catRes.weightSum
}

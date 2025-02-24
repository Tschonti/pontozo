import {
  AgeGroup,
  ALL_AGE_GROUPS,
  ALL_ROLES,
  Category,
  CategoryWithCriteria,
  CriterionWithWeight,
  getAgeGroupFromAge,
  RatingResultItem,
  RatingRole,
} from '@pontozo/common'
import CriterionRating from '../typeorm/entities/CriterionRating'
import EventRating from '../typeorm/entities/EventRating'
import { RatingResult } from '../typeorm/entities/RatingResult'
import Stage from '../typeorm/entities/Stage'

type Average = {
  count: number
  average: number
}

type TempAverage = {
  count: number
  sum: number
}

type ResultsPerRole<T> = { [R in RatingRole]: T }
type ResulstPerRoleAndGroup<T> = ResultsPerRole<T> & {
  [G in AgeGroup]: ResultsPerRole<T>
} & { score?: number; sumOfWeight?: number }

type CriterionResult<T> = ResulstPerRoleAndGroup<T> & {
  stages?: Record<number, ResulstPerRoleAndGroup<T>>
  competitorWeight?: number
  organiserWeight?: number
}

type CategoryTempResults = Record<number, CriterionResult<TempAverage>>

type CriterionResultWithAvg = CriterionResult<Average> & {
  criterionId?: number
  stages?: (ResulstPerRoleAndGroup<Average> & { stageId: number })[]
}

type CategoryWithCriteriaResults = Category & {
  criteriaResults: CriterionResultWithAvg[]
  score: number
  sumOfWeight: number
  stageId?: number
}

export type StageResult = {
  root: RatingResult
  categories: RatingResult[]
  criteria: RatingResult[]
}

const createEmptyTempResults = (): ResulstPerRoleAndGroup<TempAverage> => ({
  [RatingRole.COMPETITOR]: { count: 0, sum: 0 },
  [RatingRole.COACH]: { count: 0, sum: 0 },
  [RatingRole.ORGANISER]: { count: 0, sum: 0 },
  [RatingRole.JURY]: { count: 0, sum: 0 },
  [AgeGroup.YOUTH]: {
    [RatingRole.COMPETITOR]: { count: 0, sum: 0 },
    [RatingRole.COACH]: { count: 0, sum: 0 },
    [RatingRole.ORGANISER]: { count: 0, sum: 0 },
    [RatingRole.JURY]: { count: 0, sum: 0 },
  },
  [AgeGroup.ELITE]: {
    [RatingRole.COMPETITOR]: { count: 0, sum: 0 },
    [RatingRole.COACH]: { count: 0, sum: 0 },
    [RatingRole.ORGANISER]: { count: 0, sum: 0 },
    [RatingRole.JURY]: { count: 0, sum: 0 },
  },
  [AgeGroup.MASTER]: {
    [RatingRole.COMPETITOR]: { count: 0, sum: 0 },
    [RatingRole.COACH]: { count: 0, sum: 0 },
    [RatingRole.ORGANISER]: { count: 0, sum: 0 },
    [RatingRole.JURY]: { count: 0, sum: 0 },
  },
})

const createEmptyResults = (): ResulstPerRoleAndGroup<Average> => ({
  [RatingRole.COMPETITOR]: { count: 0, average: -1 },
  [RatingRole.COACH]: { count: 0, average: -1 },
  [RatingRole.ORGANISER]: { count: 0, average: -1 },
  [RatingRole.JURY]: { count: 0, average: -1 },
  [AgeGroup.YOUTH]: {
    [RatingRole.COMPETITOR]: { count: 0, average: -1 },
    [RatingRole.COACH]: { count: 0, average: -1 },
    [RatingRole.ORGANISER]: { count: 0, average: -1 },
    [RatingRole.JURY]: { count: 0, average: -1 },
  },
  [AgeGroup.ELITE]: {
    [RatingRole.COMPETITOR]: { count: 0, average: -1 },
    [RatingRole.COACH]: { count: 0, average: -1 },
    [RatingRole.ORGANISER]: { count: 0, average: -1 },
    [RatingRole.JURY]: { count: 0, average: -1 },
  },
  [AgeGroup.MASTER]: {
    [RatingRole.COMPETITOR]: { count: 0, average: -1 },
    [RatingRole.COACH]: { count: 0, average: -1 },
    [RatingRole.ORGANISER]: { count: 0, average: -1 },
    [RatingRole.JURY]: { count: 0, average: -1 },
  },
  score: -1,
})

const addToTempResults = (results: CategoryTempResults, cr: CriterionRating, ageGroup: AgeGroup, role: RatingRole) => {
  if (!results[cr.criterionId]) {
    results[cr.criterionId] = createEmptyTempResults()
  }

  // only calculate general averages if the criterion is not stage specific
  if (!cr.stageId) {
    results[cr.criterionId][role].count++
    results[cr.criterionId][role].sum += cr.value

    results[cr.criterionId][ageGroup][role].count++
    results[cr.criterionId][ageGroup][role].sum += cr.value
  }

  if (cr.stageId && !results[cr.criterionId].stages?.[cr.stageId]) {
    if (!results[cr.criterionId].stages) {
      results[cr.criterionId].stages = {}
    }
    results[cr.criterionId].stages[cr.stageId] = createEmptyTempResults()
  }

  if (cr.stageId) {
    results[cr.criterionId].stages[cr.stageId][role].count++
    results[cr.criterionId].stages[cr.stageId][role].sum += cr.value

    results[cr.criterionId].stages[cr.stageId][ageGroup][role].count++
    results[cr.criterionId].stages[cr.stageId][ageGroup][role].sum += cr.value
  }
}

const calcAvgForCriterion = (tempResult: ResulstPerRoleAndGroup<TempAverage>, results: CriterionResultWithAvg) => {
  ALL_ROLES.forEach((rr) => {
    results[rr].count = tempResult[rr].count
    results[rr].average = tempResult[rr].count === 0 ? -1 : tempResult[rr].sum / tempResult[rr].count
    ALL_AGE_GROUPS.forEach((ag) => {
      results[ag][rr].count = tempResult[ag][rr].count
      results[ag][rr].average = tempResult[ag][rr].count === 0 ? -1 : tempResult[ag][rr].sum / tempResult[ag][rr].count
    })
  })
}

const calcGeneralAvgForStageSepcificCriterion = (results: CriterionResultWithAvg) => {
  ALL_ROLES.forEach((rr) => {
    results[rr].count = results.stages.reduce((count, stage) => count + stage[rr].count, 0)
    results[rr].average =
      results[rr].count === 0 ? -1 : results.stages.reduce((sum, stage) => sum + stage[rr].average, 0) / results.stages.length
    ALL_AGE_GROUPS.forEach((ag) => {
      results[ag][rr].count = results.stages.reduce((count, stage) => count + stage[ag][rr].count, 0)
      results[ag][rr].average =
        results[ag][rr].count === 0 ? -1 : results.stages.reduce((sum, stage) => sum + stage[ag][rr].average, 0) / results.stages.length
    })
  })
}

export const accumulateCriteria = (
  ratings: EventRating[],
  categories: CategoryWithCriteria<CriterionWithWeight>[],
  stages: Stage[]
): CategoryWithCriteriaResults[] => {
  // sum and count all the valid ratings for each criteria (also grouped by age group, rating role and stages)
  const tempResults: CategoryTempResults = {}
  ratings.forEach((er) => {
    er.ratings.filter((cr) => cr.value > -1).forEach((cr) => addToTempResults(tempResults, cr, getAgeGroupFromAge(er.raterAge), er.role))
  })

  // for each category, calculate the avarage rating of each group for each criterion
  return categories.map(({ criteria, ...cat }) => ({
    score: -1,
    sumOfWeight: 0,
    ...cat,
    criteriaResults: criteria.map((crit) => {
      const tempResult = tempResults[crit.id]
      const results: CriterionResultWithAvg = {
        ...createEmptyResults(),
        criterionId: crit.id,
        organiserWeight: crit.weight?.organiserWeight ?? 1,
        competitorWeight: crit.weight?.competitorWeight ?? 1,
        stages: crit.stageSpecific ? stages.map((s) => ({ ...createEmptyResults(), stageId: s.id })) : undefined,
      }

      if (tempResult) {
        // for stage specific criteria, the root scores are based on the results of the stages, for normal criteria they are calculated from the general temp results.
        if (tempResult.stages) {
          Object.keys(tempResult.stages).forEach((stageId) => {
            calcAvgForCriterion(
              tempResult.stages[stageId],
              results.stages.find((s) => s.stageId === parseInt(stageId))
            )
          })
          calcGeneralAvgForStageSepcificCriterion(results)
        } else {
          calcAvgForCriterion(tempResult, results)
        }
      }

      return results
    }),
  }))
}

/**
 * Returns only the result object for the stages, only with stage specific categories and criteria
 */
export const extractStageResults = (
  results: CategoryWithCriteriaResults[],
  categories: Category[],
  stages: Stage[]
): CategoryWithCriteriaResults[][] => {
  return stages.map((s) =>
    categories.map((cat) => {
      const catRes = results.find((cr) => cr.id === cat.id)
      return {
        ...catRes,
        stageId: s.id,
        criteriaResults: catRes.criteriaResults.map((critRes) => ({
          ...critRes.stages.find((critStage) => critStage.stageId === s.id),
          organiserWeight: critRes.organiserWeight,
          competitorWeight: critRes.competitorWeight,
          criterionId: critRes.criterionId,
        })),
      }
    })
  )
}

const calculateCriterionScore = (critRes: ResulstPerRoleAndGroup<Average>, compWeight: number, orgWeight: number) => {
  const allRatingCount = ALL_ROLES.reduce((count, role) => count + critRes[role].count, 0)
  if (allRatingCount === 0) {
    critRes.score = -1
    critRes.sumOfWeight = 0
  } else {
    const comptetitorCount = [RatingRole.COMPETITOR, RatingRole.COACH].reduce((count, role) => count + critRes[role].count, 0)
    const organiserCount = [RatingRole.ORGANISER, RatingRole.JURY].reduce((count, role) => count + critRes[role].count, 0)
    let score = 0
    if (comptetitorCount > 0) {
      score +=
        (compWeight *
          (critRes[RatingRole.COMPETITOR].average * critRes[RatingRole.COMPETITOR].count +
            critRes[RatingRole.COACH].average * critRes[RatingRole.COACH].count)) /
        comptetitorCount
    }
    if (organiserCount > 0) {
      score +=
        (orgWeight *
          (critRes[RatingRole.ORGANISER].average * critRes[RatingRole.ORGANISER].count +
            critRes[RatingRole.JURY].average * critRes[RatingRole.JURY].count)) /
        organiserCount
    }
    critRes.sumOfWeight = (comptetitorCount > 0 ? compWeight : 0) + (organiserCount > 0 ? orgWeight : 0)
    critRes.score = score / critRes.sumOfWeight
  }
}

export const calculateScoresForStage = (results: CategoryWithCriteriaResults[]) => {
  results.forEach((catRes) => {
    catRes.criteriaResults.forEach((critRes) => {
      calculateCriterionScore(critRes, critRes.competitorWeight, critRes.organiserWeight)
      critRes.stages?.forEach((s) => calculateCriterionScore(s, critRes.competitorWeight, critRes.organiserWeight))
    })
    const catScore = catRes.criteriaResults.reduce(
      (temp, critRes) => ({
        weightSum: temp.weightSum + critRes.sumOfWeight,
        scoreSum: temp.scoreSum + critRes.sumOfWeight * critRes.score,
      }),
      { weightSum: 0, scoreSum: 0 }
    )
    catRes.sumOfWeight = catScore.weightSum
    catRes.score = catScore.weightSum === 0 ? -1 : catScore.scoreSum / catScore.weightSum
  })
  const rootScore = results.reduce(
    (temp, catRes) => ({
      weightSum: temp.weightSum + catRes.sumOfWeight,
      scoreSum: temp.scoreSum + catRes.sumOfWeight * catRes.score,
    }),
    { weightSum: 0, scoreSum: 0 }
  )
  return rootScore.weightSum === 0 ? -1 : rootScore.scoreSum / rootScore.weightSum
}

const mapCriterionResultToRRI = (critRes: CriterionResultWithAvg): RatingResultItem[] => {
  const rris: RatingResultItem[] = []
  ALL_ROLES.forEach((rr) => {
    const result = critRes[rr]
    if (result.count > 0) {
      rris.push({ ...result, role: rr })
    }
  })
  ALL_AGE_GROUPS.forEach((ag) => {
    ALL_ROLES.forEach((rr) => {
      const result = critRes[ag][rr]
      if (result.count > 0) {
        rris.push({ ...critRes[ag][rr], role: rr, ageGroup: ag })
      }
    })
  })
  return rris
}

export const mapToRatingResults = (eventId: number, catResults: CategoryWithCriteriaResults[], rootScore: number): StageResult => {
  const rootResult = new RatingResult()
  rootResult.eventId = eventId
  rootResult.score = rootScore
  rootResult.stageId = catResults[0].stageId
  const categoryResults: RatingResult[] = catResults.map((catRes) => {
    const catRR = new RatingResult()
    catRR.eventId = eventId
    catRR.score = catRes.score
    catRR.categoryId = catRes.id
    catRR.parent = rootResult
    catRR.stageId = catRes.stageId

    const criterionResults = catRes.criteriaResults.map((critRes) => {
      const critRR = new RatingResult()
      critRR.competitorWeight = critRes.competitorWeight
      critRR.organiserWeight = critRes.organiserWeight
      critRR.criterionId = critRes.criterionId
      critRR.score = critRes.score
      critRR.parent = catRR
      critRR.eventId = eventId
      critRR.items = JSON.stringify(mapCriterionResultToRRI(critRes))
      critRR.stageId = catRes.stageId
      return critRR
    })
    catRR.children = criterionResults

    return catRR
  })
  return { root: rootResult, categories: categoryResults, criteria: categoryResults.flatMap((c) => c.children) }
}

import { CriterionWeightKey, CriterionWithWeight, RatingRole } from '@pontozo/common'

export const criterionWeightReducer = (key: CriterionWeightKey | 'both') => (sum: number, criterion: CriterionWithWeight) => {
  if (key === 'competitorWeight' || key === 'both') {
    const enabled = criterion.roles.includes(RatingRole.COMPETITOR) || criterion.roles.includes(RatingRole.COACH)
    sum += criterion.weight?.competitorWeight ?? (enabled ? 1 : 0)
  }
  if (key === 'organiserWeight' || key === 'both') {
    const enabled = criterion.roles.includes(RatingRole.ORGANISER) || criterion.roles.includes(RatingRole.JURY)
    sum += criterion.weight?.organiserWeight ?? (enabled ? 1 : 0)
  }
  return sum
}

export const getWeight = (criterion: CriterionWithWeight, key: CriterionWeightKey): number => {
  let enabled = false
  if (key === 'competitorWeight') {
    enabled = criterion.roles.includes(RatingRole.COMPETITOR) || criterion.roles.includes(RatingRole.COACH)
  } else {
    enabled = criterion.roles.includes(RatingRole.ORGANISER) || criterion.roles.includes(RatingRole.JURY)
  }
  return criterion.weight?.[key] ?? (enabled ? 1 : 0)
}

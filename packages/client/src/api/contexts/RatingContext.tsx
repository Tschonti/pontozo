import { CategoryWithCriteria, DbStage, EventRatingInfo } from '@pontozo/common'
import { createContext } from 'react'

export type RatingContextType = {
  eventRatingInfo: EventRatingInfo | undefined
  infoLoading: boolean
  currentStage: DbStage | undefined
  currentCategory: CategoryWithCriteria | undefined
  categoryIdx: number
  stageIdx: number
  ratingId: number
  hasPrev: boolean
  hasNext: boolean
  validate: boolean
  startRating: (ratingId: number) => void
  rateCriterion: (criterionId: number) => void
  removeCriterionRating: (criterionId: number) => void
  rateCriteria: (criterionId: number[]) => void
  nextCategory: () => void
  previousCategory: () => void
}

export const RatingContext = createContext<RatingContextType>({
  eventRatingInfo: undefined,
  infoLoading: false,
  ratingId: -1,
  currentStage: undefined,
  currentCategory: undefined,
  categoryIdx: 0,
  stageIdx: -1,
  hasPrev: false,
  hasNext: true,
  validate: false,
  startRating: () => {},
  rateCriterion: () => {},
  removeCriterionRating: () => {},
  rateCriteria: () => {},
  nextCategory: () => {},
  previousCategory: () => {},
})

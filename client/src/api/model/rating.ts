import { CategoryWithCriteria } from './category'
import { EventSection, EventSectionPreview } from './event'

export interface EventRating {
  id: number
  eventId: number
  /*ratings: CriterionRating*/
  //status: RatingStatus
  role: RatingRole
  createdAt: Date
  submittedAt?: Date
}

export enum RatingRole {
  COMPETITOR = 'COMPETITOR',
  COACH = 'COACH',
  ORGANISER = 'ORGANISER',
  JURY = 'JURY'
}

export interface StartRatingDto {
  eventId: number
  role: RatingRole
}

export interface EventToRate {
  eventId: number
  eventName: string
  categoriesWithCriteria: CategoryWithCriteria[]
  nextStageId?: number
}

export interface StageToRate {
  eventId: number
  eventName: string
  categoriesWithCriteria: CategoryWithCriteria[]
  stageIdx: number
  stageCount: number
  nextStageId?: number
  prevStageId?: number
  stage: EventSection
}

export interface CriterionRating {
  id: number
  value: number
  criterionId: number
}

export interface EventRatingInfo extends EventRating {
  eventName: string
  stages: EventSectionPreview[]
  eventCategories: CategoryWithCriteria[]
  stageCategories: CategoryWithCriteria[]
}

export interface GetCriterionRatings {
  criterionIds: number[]
  stageId?: number
}

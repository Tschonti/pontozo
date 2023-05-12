import { CategoryWithCriteria } from './category'
import { EventSectionPreview } from './event'

export interface EventRating {
  id: number
  eventId: number
  /*ratings: CriterionRating*/
  status: RatingStatus
  role: RatingRole
  createdAt: Date
  submittedAt?: Date
}

export enum RatingStatus {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED'
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

export interface GetEvenRating {
  rating: EventRating | null
}

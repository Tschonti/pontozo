import { CategoryWithCriteria } from './category'
import { DbEvent, DbStage } from './dbEvent'

export interface EventRating {
  id: number
  eventId: number
  status: RatingStatus
  role: RatingRole
  userId: number
  createdAt: Date
  submittedAt?: Date
}

export interface EventRatingWithEvent extends EventRating {
  event: DbEvent
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
  stages: DbStage[]
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

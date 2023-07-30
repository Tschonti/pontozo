import { ArrayUnique, IsEnum, IsInt, IsOptional, Min } from 'class-validator'
import { CategoryWithCriteria } from './categories'
import { DbEvent, DbStage } from './dbEvents'

export enum RatingStatus {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED',
}

export enum RatingRole {
  COMPETITOR = 'COMPETITOR',
  COACH = 'COACH',
  ORGANISER = 'ORGANISER',
  JURY = 'JURY',
}

export interface EventRating {
  id: number
  eventId: number
  userId: number
  status: RatingStatus
  role: RatingRole
  createdAt: Date
  submittedAt?: Date
}

export interface EventRatingWithEvent extends EventRating {
  event: DbEvent
}

export class CreateEventRating {
  @IsInt()
  @Min(1)
  eventId: number

  @IsEnum(RatingRole)
  role: RatingRole
}

export interface EventRatingInfo extends EventRating {
  eventName: string
  stages: DbStage[]
  eventCategories: CategoryWithCriteria[]
  stageCategories: CategoryWithCriteria[]
}

export class GetCriterionRatings {
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  criterionIds: number[]

  @IsOptional()
  @IsInt()
  @Min(1)
  stageId?: number
}

export interface GetEventRating {
  rating: EventRating | null
}

export type RatingStartedResponse = {
  id: number
  status: string
}

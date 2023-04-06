import { Criterion } from './criterion'

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

export interface RatingWithCriterionDto extends EventRating {
  criteria: Criterion[]
}

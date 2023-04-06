import { EventRating, RatingRole } from './rating'

export interface Criterion {
  id: number
  name: string
  description: string
  minValue: number
  maxValue: number
  weight: number
  roles: RatingRole[]
}

export interface CriterionDetails extends Criterion {
  ratings: EventRating[]
}

export type CreateCriterion = Omit<Criterion, 'id'>

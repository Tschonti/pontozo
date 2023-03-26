import { Rating } from './rating'

export interface Criterion {
  id: number
  name: string
  description: string
  minValue: number
  maxValue: number
  weight: number
}

export interface CriterionDetails extends Criterion {
  Ratings: Rating[]
}

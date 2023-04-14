import Rating from '../../../lib/typeorm/entities/CriterionRating'

export interface CriterionToRate {
  id: number
  name: string
  description: string
  minValue: number
  maxValue: number
  weight: number
  rating: Rating
  roles: string
}

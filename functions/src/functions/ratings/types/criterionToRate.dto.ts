import Criterion from '../../../typeorm/entities/Criterion'
import Rating from '../../../typeorm/entities/CriterionRating'

export interface CriterionToRate extends Omit<Criterion, 'ratings'> {
  rating: Rating
}

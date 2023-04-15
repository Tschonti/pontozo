import EventRating from '../../../typeorm/entities/EventRating'
import { CriterionToRate } from './criterionToRate.dto'

export interface EventToRate extends EventRating {
  criteria: CriterionToRate[]
  event: any
}

import EventRating from '../../../typeorm/entities/EventRating'
import { CriterionToRate } from './criterionToRate.dto'

export interface EventToRate extends EventRating {
  eventId: number
  eventName: string
  eventCriteria: CriterionToRate[]
  nextStageId?: number
}

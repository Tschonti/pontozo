import { EventSection } from '../../../service/types'
import EventRating from '../../../typeorm/entities/EventRating'
import { CriterionToRate } from './criterionToRate.dto'

export interface EventToRate extends EventRating {
  criteria: CriterionToRate[]
  eventId: number
  eventName: string
  eventCriteria: CriterionToRate[]
  stages: EventSection[]
}

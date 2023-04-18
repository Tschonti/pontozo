import { EventSection } from '../../../service/types'
import EventRating from '../../../typeorm/entities/EventRating'
import { CriterionToRate } from './criterionToRate.dto'

export interface StageToRate extends EventRating {
  criteria: CriterionToRate[]
  eventId: number
  eventName: string
  stageCriteria: CriterionToRate[]
  stage: EventSection
  nextStageId?: number
  prevStageId?: number
}
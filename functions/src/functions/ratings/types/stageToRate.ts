import { EventSection } from '../../../service/types'
import EventRating from '../../../typeorm/entities/EventRating'
import { CategoryWithCriteria } from './categoryWithCriteria'
import { CriterionToRate } from './criterionToRate.dto'

export interface StageToRate extends EventRating {
  criteria: CriterionToRate[]
  eventId: number
  eventName: string
  categoriesWithCriteria: CategoryWithCriteria[]
  stage: EventSection
  stageIdx: number
  stageCount: number
  nextStageId?: number
  prevStageId?: number
}

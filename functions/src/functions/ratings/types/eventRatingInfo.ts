import { EventSectionPreview } from '../../../service/types'
import EventRating from '../../../typeorm/entities/EventRating'
import { CategoryWithCriteria } from './categoryWithCriteria'

export interface EventRatingInfo extends EventRating {
  eventName: string
  stages: EventSectionPreview[]
  eventCategories: CategoryWithCriteria[]
  stageCategories: CategoryWithCriteria[]
}

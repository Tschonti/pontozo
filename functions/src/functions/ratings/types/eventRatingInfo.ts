import { EventSectionPreview } from '../../../service/types'
import EventRating from '../../../typeorm/entities/EventRating'

export interface EventRatingInfo extends EventRating {
  eventName: string
  stages: EventSectionPreview[]
  eventCategoryCount: number
  stageCategoryCount: number
}

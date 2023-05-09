import EventRating from '../../../typeorm/entities/EventRating'
import { CategoryWithCriteria } from './categoryWithCriteria'

export interface EventToRate extends EventRating {
  eventId: number
  eventName: string
  categoriesWithCriteria: CategoryWithCriteria[]
  nextStageId?: number
}

import EventRating from '../../../typeorm/entities/EventRating'
import Stage from '../../../typeorm/entities/Stage'
import { CategoryWithCriteria } from './categoryWithCriteria'

export interface EventRatingInfo extends EventRating {
  eventName: string
  stages: Stage[]
  eventCategories: CategoryWithCriteria[]
  stageCategories: CategoryWithCriteria[]
}

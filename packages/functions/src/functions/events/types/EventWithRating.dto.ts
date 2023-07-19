import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'

export interface EventWithRating {
  event: Event
  userRating?: EventRating
}

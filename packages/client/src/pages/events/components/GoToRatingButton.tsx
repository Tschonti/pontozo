import { Button } from '@chakra-ui/react'
import { EventWithRating, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { PATHS } from '../../../util/paths'
import { StartRatingModal } from './StartRatingModal'

export const GoToRatingButton = ({ eventWithRating }: { eventWithRating: EventWithRating }) => {
  if (eventWithRating.userRating) {
    return (
      <Button as={Link} to={`${PATHS.RATINGS}/${eventWithRating.userRating.id}?categoryIdx=0`} colorScheme="brand">
        {eventWithRating.userRating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelésed szerkesztése'}
      </Button>
    )
  }
  return <StartRatingModal event={eventWithRating.event} />
}

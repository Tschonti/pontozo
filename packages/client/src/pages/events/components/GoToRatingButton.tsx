import { Button } from '@chakra-ui/react'
import { EventWithRating, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { PATHS } from '../../../util/paths'
import { StartRatingModal } from './StartRatingModal'

export const GoToRatingButton = ({ eventWithRating }: { eventWithRating: EventWithRating }) => {
  if (eventWithRating.userRating) {
    let url = `${PATHS.RATINGS}/${eventWithRating.userRating.id}?categoryIdx=`
    if (eventWithRating.userRating.status === RatingStatus.STARTED) {
      url += `${eventWithRating.userRating.currentCategoryIdx}`
      if (eventWithRating.userRating.currentStageIdx > -1) {
        url += `&stageIdx=${eventWithRating.userRating.currentStageIdx}`
      }
    } else {
      url += '0'
    }
    return (
      <Button as={Link} to={url} colorScheme="brand">
        {eventWithRating.userRating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelés folytatása'}
      </Button>
    )
  }
  return <StartRatingModal event={eventWithRating.event} />
}

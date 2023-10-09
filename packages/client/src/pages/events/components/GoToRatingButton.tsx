import { Button } from '@chakra-ui/react'
import { EventWithRating, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { PATHS } from '../../../util/paths'

type Props = {
  eventWithRating: EventWithRating
  onStartClick: () => void
  isLoading: boolean
  startDisabled: boolean
  continueDisabled: boolean
}

export const GoToRatingButton = ({ eventWithRating, onStartClick, startDisabled, isLoading, continueDisabled }: Props) => {
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
      <Button
        as={Link}
        to={eventWithRating.userRating.status !== RatingStatus.SUBMITTED && continueDisabled ? undefined : url}
        colorScheme="brand"
        isDisabled={eventWithRating.userRating.status !== RatingStatus.SUBMITTED && continueDisabled}
      >
        {eventWithRating.userRating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelés folytatása'}
      </Button>
    )
  }
  return (
    <Button colorScheme="brand" isLoading={isLoading} onClick={onStartClick} isDisabled={startDisabled}>
      Értékelés kezdése
    </Button>
  )
}

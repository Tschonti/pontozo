import { Button } from '@chakra-ui/react'
import { EventWithRating, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { PATHS } from '../../../util/paths'

type Props = {
  eventWithRating: EventWithRating
  onStartClick: () => void
  disabled: boolean
}

export const GoToRatingButton = ({ eventWithRating, onStartClick, disabled }: Props) => {
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
  return (
    <Button colorScheme="brand" onClick={onStartClick} isDisabled={disabled}>
      Értékelésed kezdése
    </Button>
  )
}

import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchEventRatingQuery } from '../../../api/hooks/ratingHooks'
import { Event } from '../../../api/model/event'
import { RatingStatus } from '../../../api/model/rating'
import { PATHS } from '../../../util/paths'
import { StartRatingModal } from './StartRatingModal'

export const GoToRatingButton = ({ event }: { event: Event }) => {
  const { data, isLoading } = useFetchEventRatingQuery(event.esemeny_id)

  if (isLoading) {
    return (
      <Button colorScheme="green" isLoading>
        Értékelés
      </Button>
    )
  }

  if (data?.rating) {
    return (
      <Button as={Link} to={`${PATHS.RATINGS}/${data.rating.id}?categoryIdx=0`} colorScheme="green">
        {data.rating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelésed szerkesztése'}
      </Button>
    )
  }
  return <StartRatingModal event={event} />
}
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchEventRatingQuery } from '../../../api/hooks/ratingHooks'
import { MtfszEvent } from '../../../api/model/mtfszEvent'
import { RatingStatus } from '../../../api/model/rating'
import { PATHS } from '../../../util/paths'
import { StartRatingModal } from './StartRatingModal'

export const GoToRatingButton = ({ event }: { event: MtfszEvent }) => {
  const { data, isLoading } = useFetchEventRatingQuery(event.esemeny_id)

  if (isLoading) {
    return (
      <Button colorScheme="brand" isLoading>
        Értékelés
      </Button>
    )
  }

  if (data?.rating) {
    return (
      <Button as={Link} to={`${PATHS.RATINGS}/${data.rating.id}?categoryIdx=0`} colorScheme="brand">
        {data.rating.status === RatingStatus.SUBMITTED ? 'Értékelésed megtekintése' : 'Értékelésed szerkesztése'}
      </Button>
    )
  }
  return <StartRatingModal event={event} />
}

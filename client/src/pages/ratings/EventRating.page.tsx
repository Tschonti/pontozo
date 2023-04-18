import { Button, Heading, HStack, Spinner, VStack } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchEventRatingQuery } from '../../api/hooks/ratingHooks'
import { PATHS } from '../../util/paths'
import { CriterionRateForm } from './components/CriterionRateForm'

export const EventRatingPage = () => {
  const { ratingId } = useParams()
  const { data, isLoading, error } = useFetchEventRatingQuery(+ratingId!!)
  const nav = useNavigate()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <>
      <Heading>{data?.eventName} értékelése</Heading>
      <VStack my={5}>
        {data?.eventCriteria.map((c) => (
          <CriterionRateForm criterion={c} eventRatingId={+ratingId!!} key={c.id} />
        ))}
      </VStack>

      <HStack justify="space-between" w="100%">
        <Button leftIcon={<FaArrowLeft />} onClick={() => nav(`${PATHS.EVENTS}/${data?.eventId}`)}>
          Vissza
        </Button>
        <Button colorScheme="green" onClick={() => nav(`${PATHS.RATINGS}/${ratingId}/stage/${data?.nextStageId}`)}>
          Tovább
        </Button>
      </HStack>
    </>
  )
}

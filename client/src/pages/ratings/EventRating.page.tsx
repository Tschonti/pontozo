import { Button, Heading, HStack, Spinner } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchEventRatingQuery } from '../../api/hooks/ratingHooks'
import { PATHS } from '../../util/paths'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'

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
      <Heading size="sm">A teljes versenyre vonatkozó szempontok szerint</Heading>
      {data?.categoriesWithCriteria.map((category) => (
        <CategoryWithCriteriaList category={category} ratingId={+ratingId!!} />
      ))}

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

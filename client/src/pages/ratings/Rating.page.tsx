import { Heading, Spinner, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useFetchRatingQuery } from '../../api/hooks/ratingHooks'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { data, isLoading, error } = useFetchRatingQuery(+ratingId!!)

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <>
      <Heading>{data?.eventId} értékelése</Heading>
      {data?.criteria.map((c) => (
        <Text>{c.name}</Text>
      ))}
    </>
  )
}

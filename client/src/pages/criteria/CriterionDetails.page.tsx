import { Box, Button, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRateCriteriaMutation } from '../../api/hooks/criteriaMutationHook'
import { useFetchCriterion } from '../../api/hooks/criteriaQueryHook'

export const CriterionDetailsPage = () => {
  const { criterionId } = useParams()
  const { isLoading, error, data, refetch } = useFetchCriterion(+criterionId!!, (data) => setRating(data.minValue))
  const rateMutation = useRateCriteriaMutation(+criterionId!!)
  const [rating, setRating] = useState(0)
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    console.error(error)
    return null
  }
  return (
    <>
      <Heading>{data?.name}</Heading>
      <Text>{data?.description}</Text>
      <Heading size="md">Értékelésed: {rating}</Heading>
      <Slider min={data?.minValue} max={data?.maxValue} value={rating} onChange={(e) => setRating(e)}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Button colorScheme="green" onClick={() => rateMutation.mutate(rating, { onSuccess: () => refetch() })}>
        Mentés
      </Button>
      <Heading size="md">Értékelések</Heading>
      {data?.Ratings.map((r) => (
        <Box key={r.id}>
          <Text>{r.value}</Text>
        </Box>
      ))}
    </>
  )
}

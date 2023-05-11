import { Heading, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useRatingContext } from '../../../api/contexts/useRatingContext'
import { useFetchRatingsMutation } from '../../../api/hooks/ratingHooks'
import { CriterionRateForm } from './CriterionRateForm'

type Props = {
  ratingId: number
}

export const CategoryWithCriteriaList = ({ ratingId }: Props) => {
  const mutation = useFetchRatingsMutation(+ratingId!!)
  const { eventRatingInfo, currentCategory, currentStage, categoryIdx } = useRatingContext()

  useEffect(() => {
    if (eventRatingInfo) {
      mutation.mutate({ criterionIds: (currentCategory?.criteria || []).map((c) => c.id), stageId: currentStage?.program_id })
    }
  }, [eventRatingInfo, currentCategory, currentStage])

  const criteria = currentCategory?.criteria.map((c) => ({
    ...c,
    rating: mutation.data?.find((cr) => cr.criterionId === c.id)
  }))

  return (
    <VStack my={5} alignItems="flex-start">
      <Heading size="sm">
        Kategória: {currentCategory?.name} ({categoryIdx + 1}/
        {currentStage ? eventRatingInfo?.stageCategories.length : eventRatingInfo?.eventCategories.length})
      </Heading>
      <Text>{currentCategory?.description}</Text>
      {criteria?.map((criteria) => (
        <CriterionRateForm criterion={criteria} key={criteria.id} />
      ))}
    </VStack>
  )
}

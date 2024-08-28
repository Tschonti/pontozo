import { Heading, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useRatingContext } from '../../../api/contexts/useRatingContext'
import { useFetchRatingsMutation } from '../../../api/hooks/ratingHooks'
import { CriterionRateForm } from './CriterionRateForm'

type Props = {
  ratingId: number
}

export const CategoryWithCriteriaList = ({ ratingId }: Props) => {
  const mutation = useFetchRatingsMutation(+ratingId!)
  const { eventRatingInfo, currentCategory, currentStage, rateCriteria } = useRatingContext()

  useEffect(() => {
    if (eventRatingInfo) {
      mutation.mutate(
        { criterionIds: (currentCategory?.criteria || []).map((c) => c.id), stageId: currentStage?.id },
        { onSuccess: (data) => rateCriteria(data.map((r) => r.criterionId)) }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRatingInfo, currentCategory, currentStage])

  const criteria = currentCategory?.criteria.map((c) => ({
    ...c,
    rating: mutation.data?.find((cr) => cr.criterionId === c.id),
  }))

  return (
    <>
      <Heading size="md">Kategória: {currentCategory?.name}</Heading>
      {currentStage && <Heading size="md"> Futam: {currentStage.name}</Heading>}
      <Text
        mt={2}
        mb={5}
        dangerouslySetInnerHTML={{ __html: currentCategory?.description.replace('az adott', `a(z) <b>${currentStage?.name}</b>`) ?? '' }}
      />

      <VStack my={5} spacing={10} alignItems="flex-start">
        {criteria?.map((criteria) => (
          <CriterionRateForm criterion={criteria} key={criteria.id} />
        ))}
      </VStack>
    </>
  )
}

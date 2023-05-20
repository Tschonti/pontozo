import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRatingContext } from '../../../api/contexts/useRatingContext'
import { useRateCriteriaMutation } from '../../../api/hooks/criteriaHooks'
import { CriterionDetails } from '../../../api/model/criterion'
import { RatingStatus } from '../../../api/model/rating'

type Props = {
  criterion: CriterionDetails
}

export const CriterionRateForm = ({ criterion }: Props) => {
  const { ratingId, currentStage, eventRatingInfo } = useRatingContext()
  const mutation = useRateCriteriaMutation({ eventRatingId: ratingId, criterionId: criterion.id, stageId: currentStage?.program_id })
  const [value, setValue] = useState<string | undefined>(criterion.rating?.value?.toString())
  const toast = useToast()

  useEffect(() => {
    if (!value && criterion.rating) {
      setValue(criterion.rating.value.toString())
    }
  }, [criterion, value])

  const onChange = (newValue: string) => {
    mutation.mutate(+newValue, {
      onSuccess: () => {
        setValue(newValue)
      },
      onError: (e) => {
        toast({ title: e.message, description: e.name, status: 'error' })
      }
    })
  }

  return (
    <FormControl>
      <FormLabel>{criterion.name}</FormLabel>
      <FormHelperText mb={2}>{criterion.description}</FormHelperText>
      <RadioGroup isDisabled={eventRatingInfo?.status === RatingStatus.SUBMITTED} colorScheme="brand" onChange={onChange} value={value}>
        <Stack direction={['column', 'row']} spacing={5}>
          {criterion.text0 && <Radio value="0">{criterion.text0}</Radio>}
          {criterion.text1 && <Radio value="1">{criterion.text1}</Radio>}
          {criterion.text2 && <Radio value="2">{criterion.text2}</Radio>}
          {criterion.text3 && <Radio value="3">{criterion.text3}</Radio>}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

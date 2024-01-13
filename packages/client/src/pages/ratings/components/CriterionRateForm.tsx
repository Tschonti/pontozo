import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import { CriterionDetails, RatingStatus } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { onError } from 'src/util/onError'
import { useRatingContext } from '../../../api/contexts/useRatingContext'
import { useRateCriteriaMutation } from '../../../api/hooks/criteriaHooks'

type Props = {
  criterion: CriterionDetails
}

export const CriterionRateForm = ({ criterion }: Props) => {
  const { ratingId, currentStage, eventRatingInfo, validate, rateCriterion, removeCriterionRating } = useRatingContext()
  const mutation = useRateCriteriaMutation(ratingId)
  const [value, setValue] = useState<string | undefined>(criterion.rating?.value?.toString())
  const toast = useToast()

  useEffect(() => {
    if (!value && criterion.rating) {
      setValue(criterion.rating.value.toString())
    }
  }, [criterion, value])

  const onChange = (newValue: string) => {
    setValue(newValue)
    rateCriterion(criterion.id)
    mutation.mutate(
      { value: +newValue, stageId: currentStage?.id, criterionId: criterion.id },
      {
        onError: (e) => {
          setValue('')
          onError(e, toast)
          removeCriterionRating(criterion.id)
        },
      }
    )
  }

  return (
    <FormControl isInvalid={validate && !value}>
      <FormLabel fontSize="lg">{criterion.name}</FormLabel>
      <FormHelperText mb={2}>{criterion.description}</FormHelperText>
      <RadioGroup isDisabled={eventRatingInfo?.status === RatingStatus.SUBMITTED} colorScheme="brand" onChange={onChange} value={value}>
        <Stack direction={['column', 'row']} spacing={10}>
          {criterion.text0 && <Radio value="0">{criterion.text0}</Radio>}
          {criterion.text1 && <Radio value="1">{criterion.text1}</Radio>}
          {criterion.text2 && <Radio value="2">{criterion.text2}</Radio>}
          {criterion.text3 && <Radio value="3">{criterion.text3}</Radio>}
          {criterion.allowEmpty && <Radio value="-1">Nem tudom megítélni/nem releváns</Radio>}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

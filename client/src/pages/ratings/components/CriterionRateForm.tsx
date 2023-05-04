import { FormControl, FormHelperText, FormLabel, HStack, Radio, RadioGroup } from '@chakra-ui/react'
import { useState } from 'react'
import { useRateCriteriaMutation } from '../../../api/hooks/criteriaHooks'
import { CriterionDetails } from '../../../api/model/criterion'

type Props = {
  criterion: CriterionDetails
  eventRatingId: number
  stageId?: number
}

export const CriterionRateForm = ({ criterion, eventRatingId, stageId }: Props) => {
  const mutation = useRateCriteriaMutation({ eventRatingId, criterionId: criterion.id, stageId })
  const [value, setValue] = useState<string | undefined>(criterion.rating?.value?.toString())

  const onChange = (newValue: string) => {
    setValue(newValue)
    mutation.mutate(+newValue)
  }

  return (
    <FormControl>
      <FormLabel>{criterion.name}</FormLabel>
      <FormHelperText>{criterion.description}</FormHelperText>
      <RadioGroup colorScheme="green" onChange={onChange} value={value}>
        <HStack spacing={5}>
          {criterion.text0 && <Radio value="0">{criterion.text0}</Radio>}
          {criterion.text1 && <Radio value="1">{criterion.text1}</Radio>}
          {criterion.text2 && <Radio value="2">{criterion.text2}</Radio>}
          {criterion.text3 && <Radio value="3">{criterion.text3}</Radio>}
        </HStack>
      </RadioGroup>
    </FormControl>
  )
}

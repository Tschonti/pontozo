import { FormControl, FormHelperText, FormLabel, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react'
import { useState } from 'react'
import { useRateCriteriaMutation } from '../../../api/hooks/criteriaMutationHook'
import { Criterion } from '../../../api/model/criterion'

type Props = {
  criterion: Criterion
  eventRatingId: number
}

export const CriterionRateForm = ({ criterion, eventRatingId }: Props) => {
  const mutation = useRateCriteriaMutation(eventRatingId, criterion.id)
  const [value, setValue] = useState(Math.round((criterion.maxValue - criterion.minValue) / 2) + criterion.minValue)

  const onChange = (newValue: number) => {
    setValue(newValue)
    mutation.mutate(newValue)
  }

  return (
    <FormControl>
      <FormLabel>{criterion.name}</FormLabel>
      <FormHelperText>{criterion.description}</FormHelperText>
      <Slider
        min={criterion.minValue}
        max={criterion.maxValue}
        isDisabled={mutation.isLoading}
        aria-label={`slider-${criterion.name}`}
        value={value}
        onChange={onChange}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </FormControl>
  )
}

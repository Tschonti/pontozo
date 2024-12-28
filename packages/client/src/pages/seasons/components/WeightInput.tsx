import { Box, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react'
import { Criterion, CriterionWeightKey, RatingRole } from '@pontozo/common'
import debounce from 'lodash.debounce'
import { useCallback, useMemo, useState } from 'react'
import { useSetWeightsMutations } from 'src/api/hooks/seasonHooks'

type Props = {
  roles: RatingRole[]
  criterion: Criterion
  defaultValue: number
  seasonId: string
  weightKey: CriterionWeightKey
}

export const WeightInput = ({ roles, criterion, seasonId, defaultValue, weightKey }: Props) => {
  const { mutate } = useSetWeightsMutations(seasonId, criterion.id)
  const weightEditable = useMemo(() => {
    const asSet = new Set(criterion.roles)
    return roles.some((r) => asSet.has(r))
  }, [criterion, roles])
  const [value, setValue] = useState<string>(`${weightEditable ? defaultValue : 0}`)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceChange = useCallback(
    debounce((value: number) => {
      mutate({ [weightKey]: value })
    }, 500),
    []
  )

  const onValueChange = (stringValue: string, value: number) => {
    setValue(stringValue)
    if (stringValue && !isNaN(value)) {
      handleDebounceChange(value)
    }
  }

  return (
    <Box>
      <NumberInput
        bg="white"
        isDisabled={!weightEditable}
        w={20}
        size="sm"
        clampValueOnBlur={false}
        min={0}
        precision={2}
        step={0.1}
        value={value}
        onChange={onValueChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  )
}

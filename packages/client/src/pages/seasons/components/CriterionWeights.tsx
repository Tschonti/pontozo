import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react'
import { CriterionWithWeight, RatingRole } from '@pontozo/common'
import { useMemo, useState } from 'react'
import { useSetWeightsMutations } from 'src/api/hooks/seasonHooks'

type Props = {
  criterion: CriterionWithWeight
  seasonId: string
}

export const CriterionWeights = ({ criterion, seasonId }: Props) => {
  const { mutate } = useSetWeightsMutations(seasonId, criterion.id)
  const compWeightEditable = useMemo(
    () => criterion.roles.includes(RatingRole.COMPETITOR) || criterion.roles.includes(RatingRole.COACH),
    [criterion]
  )

  const orgWeightEditable = useMemo(
    () => criterion.roles.includes(RatingRole.ORGANISER) || criterion.roles.includes(RatingRole.JURY),
    [criterion]
  )
  const [compValue, setCompValue] = useState(compWeightEditable ? criterion.weight?.competitorWeight ?? 1 : 0)
  const [orgValue, setOrgValue] = useState(orgWeightEditable ? criterion.weight?.organiserWeight ?? 1 : 0)

  const compChange = (_: string, value: number) => {
    console.log(value)
    setCompValue(value)
    mutate({ competitorWeight: value, organiserWeight: orgValue })
  }
  return (
    <>
      <Text w="100%">{criterion.name}</Text>
      <Box>
        <NumberInput
          bg="white"
          isDisabled={!compWeightEditable}
          w={20}
          size="sm"
          min={0}
          precision={2}
          step={0.1}
          value={compValue}
          onChange={compChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Box>
        <NumberInput
          bg="white"
          isDisabled={!orgWeightEditable}
          w={20}
          size="sm"
          min={0}
          precision={2}
          step={0.1}
          defaultValue={orgWeightEditable ? criterion.weight?.organiserWeight ?? 1 : 0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    </>
  )
}

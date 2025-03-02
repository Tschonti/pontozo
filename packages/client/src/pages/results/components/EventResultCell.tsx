import { Text } from '@chakra-ui/react'
import { RatingResultWithChildren } from '@pontozo/common'
import { useMemo } from 'react'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { getScore } from 'src/util/resultItemHelpers'
import { TD } from './table/TD'

interface Props {
  ratingResult?: RatingResultWithChildren
  bold?: boolean
}

export const EventResultCell = ({ ratingResult, bold = false }: Props) => {
  const { selectedAgeGroups, selectedRoles } = useResultTableContext()
  const score = useMemo(() => getScore(selectedRoles, selectedAgeGroups, ratingResult), [ratingResult, selectedAgeGroups, selectedRoles])
  return (
    <TD centered>
      <Text fontWeight={bold ? 'semibold' : 'normal'}>{score === -1 ? '-' : score.toFixed(2)}</Text>
    </TD>
  )
}

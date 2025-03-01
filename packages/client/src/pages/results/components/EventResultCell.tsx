import { Text } from '@chakra-ui/react'
import { RatingResult } from '@pontozo/common'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { getCriterionScore } from 'src/util/resultItemHelpers'
import { TD } from './table/TD'

interface Props {
  ratingResult?: RatingResult
  bold?: boolean
}

export const EventResultCell = ({ ratingResult, bold = false }: Props) => {
  const { selectedAgeGroups, selectedRoles, filtersApplied } = useResultTableContext()
  if (!ratingResult) {
    return <TD centered>-</TD>
  }
  const item = getCriterionScore(ratingResult, selectedRoles, selectedAgeGroups)
  if (!filtersApplied)
    return (
      <TD centered>
        <Text fontWeight={bold ? 'semibold' : 'normal'}>{ratingResult.score === -1 ? '-' : ratingResult.score.toFixed(2)}</Text>
      </TD>
    )
  return (
    <TD centered>
      <Text fontWeight={bold ? 'semibold' : 'normal'}>{item === -1 ? '-' : item.toFixed(2)}</Text>
    </TD>
  )
}

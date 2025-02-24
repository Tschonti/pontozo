import { Text } from '@chakra-ui/react'
import { RatingResult } from '@pontozo/common'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { getResultItem } from 'src/util/resultItemHelpers'
import { TD } from './table/TD'

interface Props {
  ratingResult?: RatingResult
  bold?: boolean
}

export const EventResultCell = ({ ratingResult, bold = false }: Props) => {
  const { selectedAgeGroups, selectedRoles, filtersApplied } = useResultTableContext()
  const item = getResultItem(ratingResult?.items ?? [], selectedRoles, selectedAgeGroups)
  if (!ratingResult) {
    return <TD centered>-</TD>
  }
  if (!filtersApplied || !item)
    return (
      <TD centered>
        <Text fontWeight={bold ? 'semibold' : 'normal'}>{ratingResult.score === -1 ? '-' : ratingResult.score.toFixed(2)}</Text>
      </TD>
    )
  return (
    <TD centered>
      <Text fontWeight={bold ? 'semibold' : 'normal'}>{item.average === -1 ? '-' : item.average.toFixed(2)}</Text>
    </TD>
  )
}

import { Text, Tooltip } from '@chakra-ui/react'
import { RatingResultItem } from '@pontozo/common'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { getResultItem } from 'src/util/resultItemHelpers'
import { TD } from './table/TD'

interface Props {
  resultItems: RatingResultItem[]
  bold?: boolean
}

export const EventResultCell = ({ resultItems, bold = false }: Props) => {
  const { selectedAgeGroups, selectedRoles } = useResultTableContext()
  const item = getResultItem(resultItems, selectedRoles, selectedAgeGroups)
  if (!item)
    return (
      <TD centered>
        <Tooltip hasArrow label="Teljes versenyre vonatkozó szempont">
          -
        </Tooltip>
      </TD>
    )
  return (
    <TD centered>
      <Tooltip hasArrow label={item.count + ' értékelés alapján'}>
        <Text fontWeight={bold ? 'semibold' : 'normal'}>{item.average === -1 ? '-' : item.average.toFixed(2)}</Text>
      </Tooltip>
    </TD>
  )
}

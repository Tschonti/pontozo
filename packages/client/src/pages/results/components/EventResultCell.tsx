import { Text, Tooltip } from '@chakra-ui/react'
import { AgeGroup, RatingResultItem, RatingRole } from '@pontozo/common'
import { getResultItem } from 'src/util/getResultItem'
import { TD } from './table/TD'

interface Props {
  resultItems: RatingResultItem[]
  roles: RatingRole[]
  ageGroups: AgeGroup[]
  bold?: boolean
}

export const EventResultCell = ({ resultItems, ageGroups, roles, bold = false }: Props) => {
  const item = getResultItem(resultItems, roles, ageGroups)
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

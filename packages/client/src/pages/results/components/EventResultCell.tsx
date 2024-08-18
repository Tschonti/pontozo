import { Td, Tooltip } from '@chakra-ui/react'
import { AgeGroup, RatingResultItem, RatingRole } from '@pontozo/common'
import { getResultItem } from 'src/util/getResultItem'

interface Props {
  resultItems: RatingResultItem[]
  roles: RatingRole[]
  ageGroups: AgeGroup[]
}

export const EventResultCell = ({ resultItems, ageGroups, roles }: Props) => {
  const item = getResultItem(resultItems, roles, ageGroups)
  if (!item) return null
  return (
    <Td isNumeric>
      <Tooltip hasArrow label={item.count + ' értékelés alapján'}>
        {item.average === -1 ? '-' : item.average.toFixed(2)}
      </Tooltip>
    </Td>
  )
}

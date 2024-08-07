import { Td, Tooltip } from '@chakra-ui/react'
import { AgeGroup, RatingResultItem, RatingRole } from '@pontozo/common'

interface Props {
  resultItems: RatingResultItem[]
  role?: RatingRole
  ageGroup?: AgeGroup
}

export const EventResultCell = ({ resultItems, ageGroup, role }: Props) => {
  let item
  if (ageGroup) item = resultItems.find((ri) => ri.ageGroup === ageGroup)
  else if (role) item = resultItems.find((ri) => ri.role === role)
  else item = resultItems.find((ri) => !ri.role && !ri.ageGroup)
  if (!item) return null
  return (
    <Td isNumeric>
      <Tooltip hasArrow label={item.count + ' értékelés alapján'}>
        {item.average === -1 ? '-' : item.average.toFixed(2)}
      </Tooltip>
    </Td>
  )
}

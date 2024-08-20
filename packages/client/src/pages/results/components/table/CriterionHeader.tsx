import { HStack, Text } from '@chakra-ui/react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { CriterionId, SortOrder } from './EventResultTable'

type Props = {
  sortOrder: SortOrder
  sortCriterion?: CriterionId
  criterionId?: CriterionId
  name: string
}

export const CriterionHeader = ({ sortOrder, criterionId, sortCriterion, name }: Props) => {
  return (
    <HStack justify="center" gap={1}>
      <Text>{name}</Text>
      {sortCriterion === criterionId && (sortOrder === 'desc' ? <FaCaretDown size="1rem" /> : <FaCaretUp size="1rem" />)}
    </HStack>
  )
}

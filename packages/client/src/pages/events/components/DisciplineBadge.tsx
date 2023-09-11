import { Badge } from '@chakra-ui/react'
const getDisciplineName = new Map<number, string>([
  [1, 'Hosszútáv'],
  [2, 'Rövidtáv'],
  [3, 'Középtáv'],
  [4, 'Ultra hosszútáv'],
  [5, 'Váltó'],
  [7, 'Rövidített hosszútáv'],
])

export const DisciplineBadge = ({ disciplineId }: { disciplineId: number }) => {
  return (
    <Badge colorScheme="brand" variant="solid">
      {getDisciplineName.get(disciplineId)}
    </Badge>
  )
}

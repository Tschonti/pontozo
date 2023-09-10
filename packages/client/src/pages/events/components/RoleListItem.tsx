import { Box, Card, CardHeader, HStack, Radio } from '@chakra-ui/react'
import { RatingRole } from '@pontozo/common'
import { useAuthContext } from 'src/api/contexts/useAuthContext'

type Props = {
  role: RatingRole
  disabled?: boolean
  selected: boolean
  onSelected: () => void
}

export const RoleListItem = ({ role, disabled = false, selected, onSelected }: Props) => {
  const { loggedInUser } = useAuthContext()
  const reallyDisabled =
    disabled ||
    (role === RatingRole.COACH && !loggedInUser?.roles.map((r) => r.toString()).includes(RatingRole.COACH)) ||
    (role === RatingRole.JURY && !loggedInUser?.roles.map((r) => r.toString()).includes(RatingRole.JURY))

  const onSelect = () => {
    if (!reallyDisabled) {
      onSelected()
    }
  }
  return (
    <Card
      variant="outline"
      cursor={reallyDisabled ? 'not-allowed' : 'pointer'}
      w="100%"
      onClick={onSelect}
      borderColor={selected ? (reallyDisabled ? 'gray.500' : 'brand.500') : undefined}
      borderWidth={selected ? '2px' : undefined}
      my={!selected ? '1px' : undefined}
      px={!selected ? '1px' : undefined}
      bgColor={reallyDisabled ? 'gray.50' : undefined}
    >
      <CardHeader>
        <HStack w="100%" alignItems="center">
          <Radio size="lg" colorScheme="brand" isDisabled={reallyDisabled} isChecked={selected} pointerEvents="none" />
          <Box>{role}</Box>
        </HStack>
      </CardHeader>
    </Card>
  )
}

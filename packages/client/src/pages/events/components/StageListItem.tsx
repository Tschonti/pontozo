import { Box, Card, CardHeader, Checkbox, Heading, HStack } from '@chakra-ui/react'
import { DbStage, EventRank } from '@pontozo/common'
import { EventRankBadge } from './EventRankBadge'

type Props = {
  stage: DbStage
  onChecked: (c: boolean) => void
  checked: boolean
  disabled?: boolean
}

export const StageListItem = ({ stage, checked, onChecked, disabled = false }: Props) => {
  const reallyDisabled = disabled || stage.rank === EventRank.NONE

  const onCheck = () => {
    if (!reallyDisabled) {
      onChecked(!checked)
    }
  }

  return (
    <Card
      variant="outline"
      cursor={reallyDisabled ? 'not-allowed' : 'pointer'}
      w="100%"
      onClick={onCheck}
      borderColor={checked ? (reallyDisabled ? 'gray.500' : 'brand.500') : undefined}
      borderWidth={checked ? '2px' : undefined}
      my={!checked ? '1px' : undefined}
      px={!checked ? '1px' : undefined}
      bgColor={reallyDisabled ? 'gray.50' : undefined}
    >
      <CardHeader>
        <HStack w="100%" alignItems="center">
          <Checkbox size="lg" colorScheme="brand" isDisabled={reallyDisabled} isChecked={checked} pointerEvents="none" />
          <Box>
            <Heading size="md">{stage.name}</Heading>
            <Heading size="sm">{new Date(parseInt(stage.startTime) * 1000).toLocaleString('hu-HU')}</Heading>
            <EventRankBadge stage={stage} />
          </Box>
        </HStack>
      </CardHeader>
    </Card>
  )
}

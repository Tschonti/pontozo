import { Card, CardHeader, Checkbox, Heading, HStack, Stack, VStack } from '@chakra-ui/react'
import { DbStage, EventRank } from '@pontozo/common'
import { DisciplineBadge } from './DisciplineBadge'
import { EventRankBadge } from './EventRankBadge'

type Props = {
  stage: DbStage
  onChecked: (c: boolean) => void
  checked: boolean
  disabled?: boolean
}

export const StageListItem = ({ stage, checked, onChecked, disabled = false }: Props) => {
  const reallyDisabled = disabled || stage.rank === EventRank.NONE
  const startDate = new Date(parseInt(stage.startTime) * 1000)

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
          <Checkbox mr={1} size="lg" colorScheme="brand" isDisabled={reallyDisabled} isChecked={checked} pointerEvents="none" />
          <Stack direction={{ base: 'column', sm: 'row' }} w="100%" justify="space-between">
            <VStack alignItems="flex-start">
              <Heading size="md">{stage.name}</Heading>
              <Heading size="sm">
                {startDate.toLocaleDateString('hu-HU')} {startDate.toLocaleTimeString('hu-HU', { timeStyle: 'short' })}
              </Heading>
            </VStack>
            <Stack direction={{ base: 'row', sm: 'column' }} alignItems="flex-end">
              <EventRankBadge stage={stage} />
              <DisciplineBadge disciplineId={stage.disciplineId} />
            </Stack>
          </Stack>
        </HStack>
      </CardHeader>
    </Card>
  )
}

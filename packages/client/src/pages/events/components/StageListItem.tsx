import { Box, Card, CardHeader, Flex, Heading, HStack, useCheckbox } from '@chakra-ui/react'
import { DbStage } from '@pontozo/common'
import { EventRankBadge } from './EventRankBadge'

type Props = {
  stage: DbStage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>

export const StageListItem = ({ stage, ...props }: Props) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)
  return (
    <Card variant="outline" w="100%" {...htmlProps}>
      <CardHeader>
        <HStack w="100%" alignItems="center">
          <input {...getInputProps()} hidden />
          <Flex alignItems="center" justifyContent="center" border="2px solid" borderColor="green.500" w={4} h={4} {...getCheckboxProps()}>
            {state.isChecked && <Box w={2} h={2} bg="green.500" />}
          </Flex>
          <Box {...getLabelProps()}>
            <Heading size="md">{stage.name}</Heading>
            <Heading size="sm">{new Date(parseInt(stage.startTime) * 1000).toLocaleString('hu-HU')}</Heading>
            <EventRankBadge stage={stage} />
          </Box>
        </HStack>
      </CardHeader>
    </Card>
  )
}

import { Card, CardHeader, Heading } from '@chakra-ui/react'
import { EventRankBadge } from './EventRankBadge'
import { DbStage } from '@pontozo/types'

export const StageListItem = ({ stage }: { stage: DbStage }) => {
  return (
    <Card variant="outline" w="100%">
      <CardHeader>
        <Heading size="md">{stage.name}</Heading>
        <Heading size="sm">{new Date(parseInt(stage.startTime) * 1000).toLocaleString('hu-HU')}</Heading>
        <EventRankBadge stage={stage} />
      </CardHeader>
    </Card>
  )
}

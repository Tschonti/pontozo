import { Card, CardHeader, Heading } from '@chakra-ui/react'
import { EventRank, EventSection } from '../../../api/model/mtfszEvent'
import { EventRankBadge } from './EventRankBadge'

export const StageListItem = ({ stage, idx }: { stage: EventSection; idx: number }) => {
  return (
    <Card variant="outline" w="100%">
      <CardHeader>
        <Heading size="md">{stage.nev_1 || idx + '. futam'}</Heading>
        <Heading size="sm">{new Date(parseInt(stage.idopont_tol) * 1000).toLocaleString('hu-HU')}</Heading>
        <EventRankBadge rank={stage.futam.rangsorolo as EventRank} />
      </CardHeader>
    </Card>
  )
}

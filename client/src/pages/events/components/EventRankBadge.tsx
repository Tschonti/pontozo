import { Badge } from '@chakra-ui/react'
import { Event, EventRank } from '../../../api/model/event'
import { getHighestRank, rankColor, translateRank } from '../../../util/enumHelpers'
type Props = {
  event?: Event
  rank?: EventRank
}
export const EventRankBadge = ({ event, rank }: Props) => {
  const realRank = event
    ? getHighestRank(event.programok.filter((p) => p.tipus === 'FUTAM').map((p) => p.futam.rangsorolo as EventRank))
    : rank || EventRank.REGIONAL
  return (
    <Badge variant="solid" colorScheme={rankColor[realRank]}>
      {translateRank[realRank]}
    </Badge>
  )
}

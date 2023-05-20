import { Badge } from '@chakra-ui/react'
import { Event, EventRank } from '../../../api/model/event'
import { getHighestRank, rankColor, translateRank } from '../../../util/enumHelpers'
export const EventRankBadge = ({ event }: { event: Event }) => {
  const rank = getHighestRank(event.programok.filter((p) => p.tipus === 'FUTAM').map((p) => p.futam.rangsorolo as EventRank))
  return (
    <Badge variant="solid" colorScheme={rankColor[rank]}>
      {translateRank[rank]}
    </Badge>
  )
}

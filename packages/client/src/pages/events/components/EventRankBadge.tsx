import { Badge } from '@chakra-ui/react'
import { DbEvent, DbStage, Rank } from '../../../api/model/dbEvent'
import { rankColor, translateRank } from '../../../util/enumHelpers'
type Props = {
  event?: DbEvent
  stage?: DbStage
}
export const EventRankBadge = ({ event, stage }: Props) => {
  const realRank = event?.highestRank || stage?.rank || Rank.REGIONAL
  return (
    <Badge variant="solid" colorScheme={rankColor[realRank]}>
      {translateRank[realRank]}
    </Badge>
  )
}

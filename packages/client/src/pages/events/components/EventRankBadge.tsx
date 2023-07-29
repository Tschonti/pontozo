import { Badge } from '@chakra-ui/react'
import { DbEvent, DbStage, Rank } from '@pontozo/common'
import { rankColor, translateRank } from '../../../util/enumHelpers'

type Props = {
  event?: DbEvent
  stage?: DbStage
}
export const EventRankBadge = ({ event, stage }: Props) => {
  const realRank = (event?.highestRank as Rank) || (stage?.rank as Rank) || Rank.REGIONAL
  return (
    <Badge variant="solid" colorScheme={rankColor[realRank]}>
      {translateRank[realRank]}
    </Badge>
  )
}

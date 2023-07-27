import { Badge } from '@chakra-ui/react'
import { rankColor, translateRank } from '../../../util/enumHelpers'
import { DbEvent, DbStage, Rank } from '@pontozo/types'

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

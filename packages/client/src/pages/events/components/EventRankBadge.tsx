import { Badge } from '@chakra-ui/react'
import { DbEvent, DbStage, Rank } from '@pontozo/common'
import { rankColor, translateRank } from '../../../util/enumHelpers'

type Props = {
  event?: DbEvent
  stage?: DbStage
  fontSize?: string
}
export const EventRankBadge = ({ event, stage, fontSize }: Props) => {
  const realRank = (event?.highestRank as Rank) || (stage?.rank as Rank) || Rank.REGIONAL
  return (
    <Badge variant="solid" bg={rankColor[realRank]} fontSize={fontSize}>
      {translateRank[realRank]}
    </Badge>
  )
}

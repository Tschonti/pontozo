import { Badge } from '@chakra-ui/react'
import { EventState } from '@pontozo/common'
import { eventStateColor, translateEventState } from 'src/util/enumHelpers'

export const EventRatingStateBadge = ({ state }: { state: EventState }) => {
  return (
    <Badge colorScheme={eventStateColor[state]} variant="solid" fontSize="1rem">
      {translateEventState[state]}
    </Badge>
  )
}

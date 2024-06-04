import { Badge } from '@chakra-ui/react'
import { eventStateColor, translateEventState } from 'src/util/enumHelpers'
import { EventState } from '../../../../common/src'

export const EventRatingStateBadge = ({ state }: { state: EventState }) => {
  return (
    <Badge colorScheme={eventStateColor[state]} variant="solid" fontSize="1rem">
      {translateEventState[state]}
    </Badge>
  )
}

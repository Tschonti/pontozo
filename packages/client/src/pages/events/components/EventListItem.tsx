import { Badge, Card, CardBody, CardHeader, Heading, HStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { statusColor, translateStatus } from '../../../util/enumHelpers'
import { PATHS } from '../../../util/paths'
import { EventRankBadge } from './EventRankBadge'
import { DbEvent, RatingStatus } from '@pontozo/common'

type Props = {
  event: DbEvent
  status?: RatingStatus
}

export const EventListItem = ({ event, status }: Props) => {
  return (
    <Card variant="outline" as={Link} to={`${PATHS.EVENTS}/${event.id}`}>
      <CardHeader>
        <Heading size="md">{event.name}</Heading>
        <Heading mt={1} size="sm">
          {event.startDate}
          {event.endDate && ` - ${event.endDate}`}
        </Heading>
      </CardHeader>

      <CardBody py={2}>
        {status && (
          <HStack alignItems="center">
            <Text>Étékelés státusza:</Text>
            <Badge variant="solid" colorScheme={statusColor[status]}>
              {translateStatus[status]}
            </Badge>
          </HStack>
        )}
        <HStack w="100%" justify="space-between">
          <HStack alignItems="center">
            <Text>Rendező{event.organisers.length > 1 && 'k'}:</Text>

            {event.organisers.map((r) => (
              <Badge key={r.code}>{r.code}</Badge>
            ))}
          </HStack>
          <EventRankBadge event={event} />
        </HStack>
      </CardBody>
    </Card>
  )
}

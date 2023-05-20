import { Badge, Card, CardBody, CardHeader, Heading, HStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Event } from '../../../api/model/event'
import { RatingStatus } from '../../../api/model/rating'
import { statusColor, translateStatus } from '../../../util/enumHelpers'
import { PATHS } from '../../../util/paths'
import { EventRankBadge } from './EventRankBadge'

export const EventListItem = ({ event }: { event: Event & { status?: RatingStatus } }) => {
  return (
    <Card variant="outline" as={Link} to={`${PATHS.EVENTS}/${event.esemeny_id}`}>
      <CardHeader>
        <Heading size="md">{event.nev_1}</Heading>
        <Heading mt={1} size="sm">
          {event.datum_tol}
          {event.datum_ig && ` - ${event.datum_ig}`}
        </Heading>
      </CardHeader>

      <CardBody py={2}>
        {event.status && (
          <HStack alignItems="center">
            <Text>Étékelés státusza:</Text>
            <Badge variant="solid" colorScheme={statusColor[event.status]}>
              {translateStatus[event.status]}
            </Badge>
          </HStack>
        )}
        <HStack w="100%" justify="space-between">
          <HStack alignItems="center">
            <Text>Rendező{event.rendezok.length > 1 && 'k'}:</Text>

            {event.rendezok.map((r) => (
              <Badge key={r.kod}>{r.kod}</Badge>
            ))}
          </HStack>
          <EventRankBadge event={event} />
        </HStack>
      </CardBody>
    </Card>
  )
}

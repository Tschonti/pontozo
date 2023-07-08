import { Badge, Card, CardBody, CardHeader, Heading, HStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { EventRating } from '../../../api/model/rating'
import { statusColor, translateStatus } from '../../../util/enumHelpers'
import { PATHS } from '../../../util/paths'
import { EventRankBadge } from './EventRankBadge'

export const DbEventListItem = ({ eventRating }: { eventRating: EventRating }) => {
  return (
    <Card variant="outline" as={Link} to={`${PATHS.EVENTS}/${eventRating.eventId}`}>
      <CardHeader>
        <Heading size="md">{eventRating.event.name}</Heading>
        <Heading mt={1} size="sm">
          {eventRating.event.startDate}
          {eventRating.event.endDate && ` - ${eventRating.event.endDate}`}
        </Heading>
      </CardHeader>

      <CardBody py={2}>
        {eventRating.status && (
          <HStack alignItems="center">
            <Text>Étékelés státusza:</Text>
            <Badge variant="solid" colorScheme={statusColor[eventRating.status]}>
              {translateStatus[eventRating.status]}
            </Badge>
          </HStack>
        )}
        <HStack w="100%" justify="space-between">
          <HStack alignItems="center">
            <Text>Rendező{eventRating.event.organisers.length > 1 && 'k'}:</Text>

            {eventRating.event.organisers.map((r) => (
              <Badge key={r.code}>{r.code}</Badge>
            ))}
          </HStack>
          <EventRankBadge event={eventRating.event} />
        </HStack>
      </CardBody>
    </Card>
  )
}

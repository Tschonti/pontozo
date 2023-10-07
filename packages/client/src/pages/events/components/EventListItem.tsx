import { Badge, Card, CardBody, CardHeader, Heading, HStack, Text } from '@chakra-ui/react'
import { DbEvent, RatingStatus } from '@pontozo/common'
import { Link } from 'react-router-dom'
import { formatDateRange } from 'src/util/formatDateRange'
import { statusColor, translateStatus } from '../../../util/enumHelpers'
import { PATHS } from '../../../util/paths'
import { EventRankBadge } from './EventRankBadge'

type Props = {
  event: DbEvent
  status?: RatingStatus
}

export const EventListItem = ({ event, status }: Props) => {
  return (
    <Card justify="space-between" variant="outline" as={Link} to={`${PATHS.EVENTS}/${event.id}`}>
      <CardHeader flexGrow={1}>
        <Heading size="md">{event.name}</Heading>
        <Heading mt={1} size="sm">
          {formatDateRange(event.startDate, event.endDate)}
        </Heading>
      </CardHeader>

      <CardBody flexGrow={0} py={2}>
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

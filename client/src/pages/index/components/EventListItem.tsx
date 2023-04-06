import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Event } from '../../../api/model/event'
import { PATHS } from '../../../util/paths'

export const EventListItem = ({ event }: { event: Event }) => {
  return (
    <Card variant="outline" as={Link} to={`${PATHS.EVENTS}/${event.esemeny_id}`}>
      <CardHeader>
        <Heading size="md">{event.nev_1}</Heading>
      </CardHeader>

      <CardBody>
        <Text>
          {event.datum_tol}
          {event.datum_ig && ` - ${event.datum_ig}`}
        </Text>
      </CardBody>
    </Card>
  )
}

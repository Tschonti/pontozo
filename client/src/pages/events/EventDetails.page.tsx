import { Button, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useFetchEvent } from '../../api/hooks/eventQueryHooks'
import { PATHS } from '../../util/paths'
import { StageListItem } from './components/StageListItem'
import { StartRatingModal } from './components/StartRatingModal'

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { data, isLoading, error } = useFetchEvent(+eventId!!)
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    console.error(error)
    return null
  }
  const event = data?.result[0]!!
  return (
    <VStack alignItems="flex-start">
      <Flex justify="space-between" w="100%">
        <Heading>{event.nev_1}</Heading>
        <StartRatingModal event={event} />
      </Flex>
      <Text>
        {event.datum_tol}
        {event.datum_ig && ` - ${event.datum_ig}`}
      </Text>
      {event.rendezok.map((r) => (
        <Text key={r.rendezo_id}>{r.nev_1}</Text>
      ))}
      {event.programok
        .filter((p) => p.tipus === 'FUTAM')
        .map((p) => (
          <StageListItem stage={p} key={p.program_id} />
        ))}
      <Button leftIcon={<FaArrowLeft />} as={Link} to={PATHS.INDEX}>
        Vissza
      </Button>
    </VStack>
  )
}

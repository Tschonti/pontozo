import { Button, Flex, Heading, Spinner, Text, useToast, VStack } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFetchEvent } from '../../api/hooks/eventQueryHooks'
import { PATHS } from '../../util/paths'
import { GoToRatingButton } from './components/GoToRatingButton'
import { StageListItem } from './components/StageListItem'

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { data, isLoading, error } = useFetchEvent(+eventId!!)
  const { isLoggedIn } = useAuthContext()
  const toast = useToast()

  if (!isLoggedIn) {
    toast({ title: 'Jelentkezz be az oldal megtekintéséhez!', status: 'warning' })
    return <Navigate to={PATHS.INDEX} />
  }
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
        <GoToRatingButton event={event} />
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

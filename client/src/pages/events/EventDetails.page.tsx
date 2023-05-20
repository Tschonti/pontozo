import { Button, Heading, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react'
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
    <VStack alignItems="flex-start" spacing={3}>
      <Stack direction={['column', 'row']} justify="space-between" w="100%">
        <Heading>{event.nev_1}</Heading>
        <GoToRatingButton event={event} />
      </Stack>
      <Heading size="md">
        {event.datum_tol}
        {event.datum_ig && ` - ${event.datum_ig}`}
      </Heading>
      <Text>
        <b>Rendező{event.rendezok.length > 1 && 'k'}:</b> {event.rendezok.map((r) => r.nev_1).join(', ')}
      </Text>
      <Heading size="md" my={3}>
        Futamok
      </Heading>
      {event.programok
        .filter((p) => p.tipus === 'FUTAM')
        .sort((p1, p2) => parseInt(p1.idopont_tol) - parseInt(p2.idopont_tol))
        .map((p, i) => (
          <StageListItem stage={p} key={p.program_id} idx={i + 1} />
        ))}
      <Button leftIcon={<FaArrowLeft />} as={Link} to={PATHS.INDEX}>
        Vissza
      </Button>
    </VStack>
  )
}

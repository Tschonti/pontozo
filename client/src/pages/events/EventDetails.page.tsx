import { Button, Heading, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFetchEvent } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { GoToRatingButton } from './components/GoToRatingButton'
import { StageListItem } from './components/StageListItem'

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { data: eventWithRating, isLoading, error } = useFetchEvent(+eventId!!)
  const { isLoggedIn } = useAuthContext()
  const toast = useToast()

  if (!isLoggedIn) {
    toast({ title: 'Jelentkezz be az oldal megtekintéséhez!', status: 'warning' })
    return <Navigate to={PATHS.INDEX} />
  }
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error || !eventWithRating) {
    console.error(error)
    return null
  }
  const { event } = eventWithRating
  return (
    <VStack alignItems="flex-start" spacing={3}>
      <Stack direction={['column', 'row']} justify="space-between" w="100%">
        <Heading>{event.name}</Heading>
        <GoToRatingButton eventWithRating={eventWithRating} />
      </Stack>
      <Heading size="md">
        {event.startDate}
        {event.endDate && ` - ${event.endDate}`}
      </Heading>
      <Text>
        <b>Rendező{event.organisers.length > 1 && 'k'}:</b> {event.organisers.map((o) => o.shortName).join(', ')}
      </Text>
      <Heading size="md" my={3}>
        Futamok
      </Heading>
      {event.stages
        ?.sort((s1, s2) => parseInt(s1.startTime) - parseInt(s2.startTime))
        .map((s) => (
          <StageListItem stage={s} key={s.id} />
        ))}
      <Button leftIcon={<FaArrowLeft />} as={Link} to={PATHS.INDEX}>
        Vissza
      </Button>
    </VStack>
  )
}

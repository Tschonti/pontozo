import { Button, Heading, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoginNavigate } from 'src/components/commons/LoginNavigate'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFecthUserRatedEvents } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from '../events/components/EventListItem'

export const ProfilePage = () => {
  const { loggedInUser, onLogout, isLoggedIn } = useAuthContext()
  const eventQuery = useFecthUserRatedEvents()

  if (!isLoggedIn) {
    return <LoginNavigate />
  }

  return (
    <>
      <HelmetTitle title="Pontoz-O | Profil" />
      <HStack w="100%" justify="space-between">
        <Heading>{loggedInUser?.nev}</Heading>
        <Button onClick={() => onLogout()} colorScheme="brand">
          Kijelentkezés
        </Button>
      </HStack>

      <Heading mt={5} size="md">
        Értékelt versenyeid
      </Heading>
      {eventQuery.isLoading ? (
        <LoadingSpinner />
      ) : (eventQuery.data?.length || 0) > 0 ? (
        <SimpleGrid mt={3} spacing={4} columns={[1, 1, 2]}>
          {eventQuery.data
            ?.sort(({ event: e1 }, { event: e2 }) => -e1.startDate.localeCompare(e2.startDate))
            .map((er) => (
              <EventListItem key={er.eventId} event={er.event} status={er.status} />
            ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" fontStyle="italic">
          Még nem értékeltél egy versenyt se.
        </Text>
      )}
    </>
  )
}

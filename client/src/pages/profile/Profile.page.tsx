import { Button, Heading, HStack, SimpleGrid, Spinner, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFecthUserRatedEvents } from '../../api/hooks/eventQueryHooks'
import { PATHS } from '../../util/paths'
import { EventListItem } from '../events/components/EventListItem'

export const ProfilePage = () => {
  const { loggedInUser, onLogout, isLoggedIn } = useAuthContext()
  const eventQuery = useFecthUserRatedEvents()
  const toast = useToast()
  const nav = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Nem vagy bejelentkezve!', status: 'error' })
      nav(PATHS.INDEX)
    }
  }, [isLoggedIn])

  return (
    <>
      <HStack w="100%" justify="space-between">
        <Heading>{loggedInUser?.nev}</Heading>
        <Button onClick={() => onLogout()} colorScheme="green">
          Kijelentkezés
        </Button>
      </HStack>

      <Heading mt={5} size="md">
        Értékelt versenyeid
      </Heading>
      {eventQuery.isLoading && <Spinner />}
      <SimpleGrid mt={3} spacing={4} columns={2}>
        {eventQuery.data
          ?.sort((e1, e2) => -e1.datum_tol.localeCompare(e2.datum_tol))
          .map((e) => (
            <EventListItem key={e.esemeny_id} event={e} />
          ))}
      </SimpleGrid>
    </>
  )
}

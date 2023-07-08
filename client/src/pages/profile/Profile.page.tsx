import { Button, Heading, HStack, SimpleGrid, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFecthUserRatedEvents } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { DbEventListItem } from '../events/components/DbEventListItem'

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
        <Button onClick={() => onLogout()} colorScheme="brand">
          Kijelentkezés
        </Button>
      </HStack>

      <Heading mt={5} size="md">
        Értékelt versenyeid
      </Heading>
      {eventQuery.isLoading && <LoadingSpinner />}
      <SimpleGrid mt={3} spacing={4} columns={[1, 1, 2]}>
        {eventQuery.data
          ?.sort(({ event: e1 }, { event: e2 }) => -e1.startDate.localeCompare(e2.startDate))
          .map((e) => (
            <DbEventListItem key={e.eventId} eventRating={e} />
          ))}
      </SimpleGrid>
    </>
  )
}

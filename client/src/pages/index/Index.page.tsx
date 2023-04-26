import { Button, Link, SimpleGrid, Spinner } from '@chakra-ui/react'
import { useFetchEventsLastMonth } from '../../api/hooks/eventQueryHooks'
import { APIM_KEY } from '../../util/environment'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data: events, isLoading, error } = useFetchEventsLastMonth()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }
  return (
    <SimpleGrid spacing={4} columns={2}>
      {events
        ?.sort((e1, e2) => -e1.datum_tol.localeCompare(e2.datum_tol))
        .map((e) => (
          <EventListItem key={e.esemeny_id} event={e} />
        ))}

      <Button as={Link} href={`https://pontozo-apim.azure-api.net/user/me?subscription-key=${APIM_KEY}`}>
        Login
      </Button>
    </SimpleGrid>
  )
}

import { Alert, AlertIcon, AlertTitle, SimpleGrid, Text } from '@chakra-ui/react'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'
import { useFetchEventsLastMonthFromDb, useFetchEventsLastMonthFromMtfsz } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data: eventsFromMtfsz, isLoading: mtfszLoading, error: mtfszError } = useFetchEventsLastMonthFromMtfsz()
  const { data: eventsFromDb, isLoading: dbLoading, error: dbError } = useFetchEventsLastMonthFromDb()

  if (mtfszLoading && dbLoading) {
    return <LoadingSpinner />
  }

  if (dbError && mtfszError) {
    console.error(mtfszError)
    return <NavigateWithError to={PATHS.ERROR} error={dbError} />
  }
  const eventData = eventsFromDb || eventsFromMtfsz

  return (
    <>
      <HelmetTitle title="Pontoz-O" />
      <Alert status="warning" my={2}>
        <AlertIcon />
        <AlertTitle>Az oldal még fejlesztés alatt áll!</AlertTitle>
      </Alert>
      {(eventData?.length || 0) > 0 ? (
        <SimpleGrid spacing={4} columns={[1, 1, 2]}>
          {eventData?.map((e) => (
            <EventListItem key={e.id} event={e} />
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" fontStyle="italic">
          Jelenleg nincs egy értékelhető verseny se.
        </Text>
      )}
    </>
  )
}

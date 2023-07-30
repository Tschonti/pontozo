import { SimpleGrid } from '@chakra-ui/react'
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
    <SimpleGrid spacing={4} columns={[1, 1, 2]}>
      {eventData?.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </SimpleGrid>
  )
}

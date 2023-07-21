import { SimpleGrid } from '@chakra-ui/react'
import { useFetchEventsLastMonthFromDb, useFetchEventsLastMonthFromMtfsz } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data: eventsFromMtfsz, isLoading: mtfszLoading, error: mtfszError } = useFetchEventsLastMonthFromMtfsz()
  const { data: eventsFromDb, isLoading: dbLoading, error: dbError } = useFetchEventsLastMonthFromDb()

  if (mtfszLoading && dbLoading) {
    return <LoadingSpinner />
  }

  if (mtfszError && dbError) {
    console.error(mtfszError)
    console.error(dbError)
    return null
  }
  const eventData = eventsFromDb || eventsFromMtfsz

  return (
    <SimpleGrid spacing={4} columns={[1, 1, 2]}>
      {eventData?.map((e) => <EventListItem key={e.id} event={e} />)}
    </SimpleGrid>
  )
}

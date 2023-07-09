import { SimpleGrid } from '@chakra-ui/react'
import { useFetchEventsLastMonth } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data: events, isLoading, error } = useFetchEventsLastMonth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <SimpleGrid spacing={4} columns={[1, 1, 2]}>
      {events
        ?.sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
        .map((e) => (
          <EventListItem key={e.id} event={e} />
        ))}
    </SimpleGrid>
  )
}

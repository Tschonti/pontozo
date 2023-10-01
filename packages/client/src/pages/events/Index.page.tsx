import { Alert, AlertIcon, AlertTitle, SimpleGrid, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCacheContext } from 'src/api/contexts/useCacheContext'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { eventDataLoading, refetchEventData, eventData, eventDataError } = useCacheContext()

  useEffect(() => {
    refetchEventData()
  }, [refetchEventData])

  if (eventDataLoading) {
    return <LoadingSpinner />
  }

  if (eventDataError) {
    console.error(eventDataError)
    return <NavigateWithError to={PATHS.ERROR} error={eventDataError} />
  }

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

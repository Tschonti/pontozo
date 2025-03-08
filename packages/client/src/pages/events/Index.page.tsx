import { Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { useFetchRateableEventsFromDb } from 'src/api/hooks/eventQueryHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data, isLoading, error } = useFetchRateableEventsFromDb()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    console.error(error)
    return <NavigateWithError to={PATHS.ERROR} error={error} />
  }

  return (
    <>
      <HelmetTitle title="Pontoz-O" />

      <Heading my={5}>Értékelhető versenyek</Heading>
      {data.length > 0 ? (
        <SimpleGrid spacing={4} columns={[1, 1, 2]}>
          {data.map((e) => (
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

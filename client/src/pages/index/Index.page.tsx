import { Button, Flex, Heading, SimpleGrid, Spinner } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchEventsLastMonth } from '../../api/hooks/eventQueryHooks'
import { PATHS } from '../../util/paths'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data, isLoading, error } = useFetchEventsLastMonth()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }
  return (
    <>
      <Flex justify="space-between" my={3}>
        <Heading>Pontoz-O</Heading>
        <Button colorScheme="green" as={Link} to={PATHS.CRITERIA}>
          Admin oldal
        </Button>
      </Flex>

      <SimpleGrid spacing={4} columns={2}>
        {data?.result
          .sort((e1, e2) => -e1.datum_tol.localeCompare(e2.datum_tol))
          .map((e) => (
            <EventListItem key={e.esemeny_id} event={e} />
          ))}
      </SimpleGrid>
    </>
  )
}

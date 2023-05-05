import { Box, Button, Flex, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchSeasons } from '../../api/hooks/seasonHook'
import { PATHS } from '../../util/paths'

export const SeasonListPage = () => {
  const { isLoading, error, data } = useFetchSeasons()
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    console.error(error)
    return null
  }
  return (
    <>
      <Flex w="100%" justifyContent="space-between" mb={3}>
        <Heading>Szezonok</Heading>
        <Button colorScheme="green" as={Link} to={`${PATHS.SEASONS}/new`}>
          Új szezon
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((s) => (
          <Box w="100%" as={Link} to={`${PATHS.SEASONS}/${s.id}/edit`} borderRadius={6} borderWidth={1} p={2} key={s.id}>
            <Heading size="sm">{s.name}</Heading>
            <Text>{`${new Date(s.startDate).toLocaleDateString()} - ${new Date(s.endDate).toLocaleDateString()}`}</Text>
          </Box>
        ))}
      </VStack>
      {data?.length === 0 && (
        <Text fontStyle="italic" textAlign="center">
          Még nincs egy szezon se
        </Text>
      )}
    </>
  )
}

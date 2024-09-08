import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { useFetchSeasons } from '../../api/hooks/seasonHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'

export default function () {
  const { isLoading, error, data } = useFetchSeasons()
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <>
      <HelmetTitle title="Pontoz-O Admin | Szezonok" />
      <Flex w="100%" justifyContent="space-between" mb={3}>
        <Heading>Szezonok</Heading>
        <Button colorScheme="brand" as={Link} to={`${PATHS.SEASONS}/new`}>
          Új szezon
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((s) => (
          <Box w="100%" as={Link} to={`${PATHS.SEASONS}/${s.id}/edit`} bg="white" borderRadius={6} borderWidth={1} p={2} key={s.id}>
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

import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { useFetchCriteria } from '../../api/hooks/criteriaHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'

export const CriteriaListPage = () => {
  const { isLoading, error, data } = useFetchCriteria()
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <>
      <Flex w="100%" justifyContent="space-between" mb={3}>
        <Heading>Szempontok</Heading>
        <Button colorScheme="brand" as={Link} to={`${PATHS.CRITERIA}/new`}>
          Új szempont
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((c) => (
          <Box w="100%" as={Link} to={`${PATHS.CRITERIA}/${c.id}/edit`} borderRadius={6} borderWidth={1} p={2} key={c.id}>
            <Heading size="sm">{c.name}</Heading>
            <Text>{c.description}</Text>
          </Box>
        ))}
      </VStack>
      {data?.length === 0 && (
        <Text fontStyle="italic" textAlign="center">
          Még nincs egy szempont se
        </Text>
      )}
    </>
  )
}

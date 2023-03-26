import { Box, Button, Flex, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useFetchCriteria } from '../../api/hooks/criteriaQueryHook'
import { PATHS } from '../../util/paths'

export const CriteriaListPage = () => {
  const { isLoading, error, data } = useFetchCriteria()
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
        <Heading>Szempontok</Heading>
        <Button colorScheme="green" as={Link} to={`${PATHS.CRITERIA}/new`}>
          Új szempont
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((c) => (
          <Link to={`${PATHS.CRITERIA}/${c.id}`} key={c.id}>
            <Heading size="sm">{c.name}</Heading>

            <Text>{c.description}</Text>
          </Link>
        ))}
      </VStack>
    </>
  )
}

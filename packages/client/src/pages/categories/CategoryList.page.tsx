import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { useFetchCategories } from '../../api/hooks/categoryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'

export const CategoryListPage = () => {
  const { isLoading, error, data } = useFetchCategories()
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <>
      <HelmetTitle title="Pontoz-O Admin | Kategóriák" />
      <Flex w="100%" justifyContent="space-between" mb={3}>
        <Heading>Kategóriák</Heading>
        <Button colorScheme="brand" as={Link} to={`${PATHS.CATEGORIES}/new`}>
          Új kategória
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((c) => (
          <Box w="100%" as={Link} to={`${PATHS.CATEGORIES}/${c.id}/edit`} borderRadius={6} borderWidth={1} p={2} key={c.id}>
            <Heading size="sm">{c.name}</Heading>
            <Text>{c.description}</Text>
          </Box>
        ))}
      </VStack>
      {data?.length === 0 && (
        <Text fontStyle="italic" textAlign="center">
          Még nincs egy kategória se
        </Text>
      )}
    </>
  )
}

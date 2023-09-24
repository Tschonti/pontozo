import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { useFetchUras } from '../../api/hooks/uraHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { translateUR, urColor } from '../../util/enumHelpers'
import { PATHS } from '../../util/paths'

export const UraListPage = () => {
  const { isLoading, error, data } = useFetchUras()
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <>
      <HelmetTitle title="Pontoz-O Admin | Kiemelt Felhasználók" />
      <Flex w="100%" justifyContent="space-between" mb={3}>
        <Heading>Kiemelt felhasználók</Heading>
        <Button colorScheme="brand" as={Link} to={`${PATHS.USERS}/new`}>
          Új kinevezés
        </Button>
      </Flex>
      <VStack spacing={3} alignItems="flex-start">
        {data?.map((u) => (
          <Box w="100%" as={Link} to={`${PATHS.USERS}/${u.id}/edit`} borderRadius={6} borderWidth={1} p={2} key={u.id}>
            <HStack spacing={2}>
              <Heading size="sm">{u.userFullName}</Heading>
              <Badge colorScheme={urColor[u.role]} variant="solid">
                {translateUR[u.role]}
              </Badge>
            </HStack>
            <Text>{u.userDOB}</Text>
          </Box>
        ))}
      </VStack>
    </>
  )
}

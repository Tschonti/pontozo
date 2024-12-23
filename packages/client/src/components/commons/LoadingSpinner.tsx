import { Heading, Spinner, VStack } from '@chakra-ui/react'

export const LoadingSpinner = () => {
  return (
    <VStack justifyContent="center" alignItems="center" mt={8}>
      <Spinner size="xl" color="green" thickness="5px" emptyColor="gray.200" />
      <Heading size="md">Betöltés...</Heading>
    </VStack>
  )
}

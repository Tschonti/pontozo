import { Box, Heading, Spinner, VStack } from '@chakra-ui/react'

export const LoadingSpinner = () => {
  return (
    <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
      <VStack>
        <Spinner size="xl" color="green" thickness="5px" emptyColor="gray.200" />
        <Heading size="md">Betöltés...</Heading>
      </VStack>
    </Box>
  )
}

import { Box, Center, Spinner } from '@chakra-ui/react'

export const LoadingSpinner = () => {
  return (
    <Box w="100%" my={5}>
      <Center>
        <Spinner size="xl" color="green" thickness="4px" emptyColor="gray.200" />
      </Center>
    </Box>
  )
}

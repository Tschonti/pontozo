import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { PATHS } from 'src/util/paths'

export const ErrorPage = () => {
  return (
    <VStack alignItems="flex-start">
      <Heading>Ismeretlen hiba</Heading>
      <Text>{'Kérlek próbáld újra, és ha a hiba nem hárul el, jelezd a fejlesztőnek a feketesamu{kukac}gmail{pont}hu címen!'}</Text>
      <Button as={Link} to={PATHS.INDEX} colorScheme="brand">
        Újra próbálom
      </Button>
    </VStack>
  )
}

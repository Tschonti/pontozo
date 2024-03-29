import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { PATHS } from 'src/util/paths'

export const ErrorPage = () => {
  return (
    <VStack w="100%" alignItems="center" my={2}>
      <HelmetTitle title="Pontoz-O | Hiba" />
      <Heading>Ismeretlen hiba</Heading>
      <Text>{'Kérlek próbáld újra, és ha a hiba nem hárul el, jelezd a fejlesztőnek a feketesamu{kukac}gmail{pont}hu címen!'}</Text>
      <Button as={Link} to={PATHS.INDEX} colorScheme="brand">
        Újrapróbálom
      </Button>
    </VStack>
  )
}

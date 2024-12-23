import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from 'src/api/contexts/useAuthContext'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LocalStorageKeys } from 'src/util/localStorageKeys'
import { onLoginClick } from 'src/util/onLoginClick'
import { PATHS } from 'src/util/paths'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthContext()

  useEffect(() => {
    if (isLoggedIn) {
      navigate(PATHS.INDEX)
    }
  }, [isLoggedIn, navigate])

  const onBackToHome = () => {
    localStorage.removeItem(LocalStorageKeys.REDIRECT_ROUTE)
    navigate(PATHS.INDEX)
  }

  return (
    <VStack alignItems="flex-start" spacing={3}>
      <HelmetTitle title={`Pontoz-O`} />
      <Heading>Bejelentkezés</Heading>
      <Text>Az oldal megtekintéséhez jelentkezz be az MTFSZ felhasználóddal.</Text>
      <HStack gap={2} width="100%" justify="center">
        <Button colorScheme="brand" onClick={onLoginClick}>
          Bejelentkezés
        </Button>
        <Button onClick={onBackToHome}>Vissza a főoldalra</Button>
      </HStack>
    </VStack>
  )
}

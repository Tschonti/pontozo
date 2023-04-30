import { Button, Heading, HStack, useToast, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { PATHS } from '../../util/paths'

export const ProfilePage = () => {
  const { loggedInUser, onLogout, isLoggedIn } = useAuthContext()
  const toast = useToast()
  const nav = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Nem vagy bejelentkezve!', status: 'error' })
      nav(PATHS.INDEX)
    }
  }, [isLoggedIn])

  return (
    <VStack alignItems="flex-start">
      <HStack w="100%" justify="space-between">
        <Heading>{loggedInUser?.nev}</Heading>
        <Button onClick={() => onLogout()} colorScheme="green">
          Kijelentkezés
        </Button>
      </HStack>
    </VStack>
  )
}

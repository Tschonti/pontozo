import { Button, Flex, FormLabel, Heading, HStack, Select, useToast, VStack } from '@chakra-ui/react'
import { UserPreview, UserRole } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { onError } from 'src/util/onError'
import { useCreateUraMutation, useDeleteUraMutation, useFetchUra, useUpdateUraMutation } from '../../api/hooks/uraHooks'
import { PATHS } from '../../util/paths'
import { UserSelector } from './components/UserSelector'

export const UraCreatePage = () => {
  const uraId = parseInt(useParams<{ uraId: string }>().uraId ?? '-1')
  const { data, isLoading, error } = useFetchUra(uraId)
  const [user, setUser] = useState<UserPreview>()
  const [role, setRole] = useState<UserRole>()
  const createMutation = useCreateUraMutation()
  const updateMutation = useUpdateUraMutation(uraId)
  const deleteMutation = useDeleteUraMutation(uraId)
  const toast = useToast()
  const nav = useNavigate()

  useEffect(() => {
    if (uraId > -1 && data && !isLoading) {
      const { id, role, ...rest } = data
      setUser(rest)
      setRole(role)
    }
  }, [data, isLoading, uraId, error])

  if (error) {
    return <NavigateWithError error={error} to={PATHS.USERS} />
  }

  const onSubmit = () => {
    if (role && user) {
      if (uraId === -1) {
        createMutation.mutate(
          { role, userId: user.userId },
          {
            onSuccess: () => {
              toast({ title: 'Személy kinevezve!', status: 'success' })
              nav(PATHS.USERS)
            },
            onError: (e) => onError(e, toast),
          }
        )
      } else {
        updateMutation.mutate(
          { role },
          {
            onSuccess: () => {
              toast({ title: 'Kinevezés frissítve!', status: 'success' })
              nav(PATHS.USERS)
            },
            onError: (e) => onError(e, toast),
          }
        )
      }
    }
  }

  const onDelete = () => {
    deleteMutation.mutate(undefined, { onSuccess: () => nav(PATHS.USERS), onError: (e) => onError(e, toast) })
  }

  return (
    <VStack alignItems="flex-start" spacing={3}>
      <Heading>Személy kinevezése</Heading>
      <UserSelector setUser={setUser} user={user} edit={uraId > -1} />

      <FormLabel>Szerepkör</FormLabel>
      <Select placeholder="Válassz szerepkört!" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        <option value={UserRole.COACH}>Edző</option>
        <option value={UserRole.JURY}>MTFSZ Zsűri</option>
        <option value={UserRole.SITE_ADMIN}>Admin</option>
      </Select>

      <Flex width="100%" justifyContent="space-between">
        <Button as={Link} to={PATHS.USERS} leftIcon={<FaArrowLeft />}>
          Vissza
        </Button>
        <HStack spacing={1}>
          <Button
            type="submit"
            colorScheme="brand"
            onClick={onSubmit}
            isDisabled={!role || !user}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
          >
            Mentés
          </Button>
          {uraId > -1 && (
            <Button colorScheme="red" onClick={onDelete}>
              Törlés
            </Button>
          )}
        </HStack>
      </Flex>
    </VStack>
  )
}

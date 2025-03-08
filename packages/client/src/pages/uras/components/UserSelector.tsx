import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { UserPreview } from '@pontozo/common'
import { SubmitHandler, useForm } from 'react-hook-form'
import { transformUser } from 'src/util/typeTransforms'
import { useFetchUsersMutation } from '../../../api/hooks/mtfszHooks'
import { LoadingSpinner } from '../../../components/commons/LoadingSpinner'
import { UserSelectorForm } from '../types/UserSelectorForm'

type Props = {
  setUser: (u: UserPreview) => void
  user?: UserPreview
  edit: boolean
}

export const UserSelector = ({ setUser, user, edit }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, setValue, reset } = useForm<UserSelectorForm>()

  const mutation = useFetchUsersMutation()

  const onSubmit: SubmitHandler<UserSelectorForm> = (data) => {
    if (Object.values(data).reduce((v, a) => v + a, '').length > 0) {
      mutation.mutate(data)
    }
  }

  const clear = () => {
    setValue('firstName', '')
    setValue('lastName', '')
    setValue('yob', undefined)
    setValue('userId', undefined)
  }

  const onModalOpen = () => {
    onOpen()
    reset()
    mutation.reset()
  }

  return (
    <>
      <FormLabel>Személy</FormLabel>
      {user ? (
        <Box
          w="100%"
          borderRadius={6}
          borderWidth={1}
          p={2}
          onClick={edit ? undefined : onModalOpen}
          cursor={edit ? 'not-allowed' : 'pointer'}
          bg={edit ? 'gray.200' : 'white'}
        >
          <Heading size="sm">{user.userFullName}</Heading>

          <Text>{user.userDOB}</Text>
        </Box>
      ) : (
        <Button onClick={edit ? undefined : onModalOpen}>Személy kiválasztása</Button>
      )}

      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Személy keresése</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <VStack>
                <FormControl>
                  <FormLabel>MTFSZ azonosító (felülírja a többi mezőt)</FormLabel>
                  <Input type="number" placeholder="Azonosító" {...register('userId')} />
                </FormControl>

                <FormControl>
                  <FormLabel>Vezetéknév</FormLabel>
                  <Input placeholder="Vezetéknév" {...register('lastName')} />
                </FormControl>

                <FormControl>
                  <FormLabel>Keresztnév</FormLabel>
                  <Input placeholder="Keresztnév" {...register('firstName')} />
                </FormControl>

                <FormControl>
                  <FormLabel>Születési év</FormLabel>
                  <Input type="number" placeholder="Születési év" {...register('yob')} />
                </FormControl>
              </VStack>

              <HStack w="100%" justify="space-between" my={3}>
                <Button type="submit" colorScheme="brand" onClick={handleSubmit(onSubmit)}>
                  Keresés
                </Button>
                <Button onClick={() => clear()}>Visszaállítás</Button>
              </HStack>
            </form>
            <VStack my={2}>
              {mutation.data &&
                mutation.data.map((u) => (
                  <Box
                    w="100%"
                    borderRadius={6}
                    borderWidth={1}
                    p={2}
                    key={u.szemely_id}
                    cursor="pointer"
                    onClick={() => {
                      setUser(transformUser(u))
                      onClose()
                    }}
                  >
                    <Heading size="sm">
                      {u.vezeteknev} {u.keresztnev}
                    </Heading>

                    <Text>
                      Szül.: {u.szul_dat}, személy ID: {u.szemely_id}
                    </Text>
                  </Box>
                ))}
            </VStack>
            {mutation.data && mutation.data.length === 0 && (
              <Text my={2} fontStyle="italic" textAlign="center">
                Nincs találat!
              </Text>
            )}
            {mutation.isLoading && <LoadingSpinner />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

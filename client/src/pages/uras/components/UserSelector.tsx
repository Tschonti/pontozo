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
  Spinner,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useFetchUsersMutation } from '../../../api/hooks/mtfszHooks'
import { User } from '../../../api/model/user'
import { UserSelectorForm } from '../types/UserSelectorForm'

type Props = {
  setUser: (u: User) => void
  user?: User
}

export const UserSelector = ({ setUser, user }: Props) => {
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
  return (
    <>
      <FormLabel>Személy</FormLabel>
      {user ? (
        <Box w="100%" borderRadius={6} borderWidth={1} p={2}>
          <Heading size="sm">
            {user.vezeteknev} {user.keresztnev}
          </Heading>

          <Text>{user.szul_dat}</Text>
        </Box>
      ) : (
        <Text my={2} fontStyle="italic" textAlign="center">
          Válassz ki egy személyt!
        </Text>
      )}
      <Button
        onClick={() => {
          onOpen()
          reset()
          mutation.reset()
        }}
      >
        Személy kiválasztása
      </Button>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Személy keresése</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
              <Button type="submit" colorScheme="green" onClick={handleSubmit(onSubmit)}>
                Keresés
              </Button>
              <Button onClick={() => clear()}>Visszaállítás</Button>
            </HStack>

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
                      setUser(u)
                      onClose()
                    }}
                  >
                    <Heading size="sm">
                      {u.vezeteknev} {u.keresztnev}
                    </Heading>

                    <Text>{u.szul_dat}</Text>
                  </Box>
                ))}
            </VStack>
            {mutation.data && mutation.data.length === 0 && (
              <Text my={2} fontStyle="italic" textAlign="center">
                Nincs találat!
              </Text>
            )}
            {mutation.isLoading && <Spinner />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { Criterion } from '../../../api/model/criterion'
import { UserSelectorForm } from '../types/UserSelectorForm'

export const UserSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, reset } = useForm<UserSelectorForm>()

  return (
    <>
      <FormLabel>Személy</FormLabel>

      <Button
        onClick={() => {
          onOpen()
          reset()
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
            <InputGroup my={5}>
              <InputLeftElement h="100%">
                <FaSearch />
              </InputLeftElement>
              <Input
                autoFocus
                placeholder="Keresés..."
                size="lg"
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
                value={search}
              />
              <InputRightElement h="100%">
                <FaTimes
                  onClick={() => {
                    setSearch('')
                  }}
                  cursor="pointer"
                />
              </InputRightElement>
            </InputGroup>
            <Input
              {...register('criteria', {
                validate: (c: Criterion[]) => c.length > 0
              })}
              hidden
            />
            <VStack mb={2} maxHeight="500px" overflowY="auto">
              {isLoading || !filteredCriterionList || filteredCriterionList.length === 0 ? (
                <Text fontStyle="italic">Nincs találat</Text>
              ) : (
                filteredCriterionList.map((c) => (
                  <Box
                    borderRadius={6}
                    borderWidth={1}
                    p={2}
                    cursor="pointer"
                    key={c.id}
                    width="100%"
                    onClick={() => {
                      addCriterion(c)
                      onClose()
                    }}
                  >
                    <Text width="100%">{c.name}</Text>
                  </Box>
                ))
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

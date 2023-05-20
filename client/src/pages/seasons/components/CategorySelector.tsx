import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
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
  useToast,
  VStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FaCaretDown, FaCaretUp, FaMinus, FaSearch, FaTimes } from 'react-icons/fa'
import { useFetchCategories } from '../../../api/hooks/categoryHooks'
import { Category } from '../../../api/model/category'
import { CreateSeasonForm } from '../../../api/model/season'
import { LoadingSpinner } from '../../../components/commons/LoadingSpinner'

export const CategorySelector = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<CreateSeasonForm>()

  const toast = useToast()
  const { isLoading, data: category, error } = useFetchCategories()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState('')

  const addCategory = (category: Category) => {
    setValue('categories', [...watch('categories'), category], { shouldValidate: true })
  }

  const removeCategory = (category: Category) => {
    setValue(
      'categories',
      watch('categories').filter((c: Category) => c.id !== category.id),
      { shouldValidate: true }
    )
  }
  const moveCategory = (idx: number, category: Category, delta: number) => {
    if ((idx === 0 && delta < 0) || (idx === watch('categories').length - 1 && delta > 0)) {
      return
    }
    const newArray = watch('categories').filter((c) => c.id !== category.id)
    newArray.splice(idx + delta, 0, category)
    setValue('categories', newArray)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredCategoryList = category
    ?.filter((c1) => !watch('categories').some((c2) => c1.id === c2.id))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <FormControl isInvalid={!!errors.categories}>
        <FormLabel>Szezon kategóriái</FormLabel>
        <VStack w="100%" alignItems="flex-start" borderRadius={6} borderWidth={1} mb={2} p={2}>
          {watch('categories').map((c, idx) => (
            <Box w="100%" borderRadius={6} borderWidth={1} key={c.id}>
              <HStack flexGrow={1} p={2}>
                <VStack alignItems="flex-start" flexGrow={1}>
                  <Text width="100%">{c.name}</Text>
                </VStack>
                <IconButton
                  aria-label="Kategória előrehozása"
                  size="xs"
                  isDisabled={idx === 0}
                  icon={<FaCaretUp />}
                  colorScheme="brand"
                  onClick={() => moveCategory(idx, c, -1)}
                />
                <IconButton
                  aria-label="Kategória hátrébb vitele"
                  size="xs"
                  isDisabled={idx === watch('categories').length - 1}
                  icon={<FaCaretDown />}
                  colorScheme="brand"
                  onClick={() => moveCategory(idx, c, 1)}
                />
                <IconButton
                  aria-label="Kategória eltávolítása a kategóriából"
                  size="xs"
                  icon={<FaMinus />}
                  colorScheme="red"
                  onClick={() => removeCategory(c)}
                />
              </HStack>
            </Box>
          ))}
          {watch('categories').length === 0 && (
            <Text fontStyle="italic" textAlign="center">
              Egy kategória sincs kiválasztva
            </Text>
          )}
        </VStack>
        <FormErrorMessage>Legalább egy kategóriát válassz ki!</FormErrorMessage>
        <Button
          onClick={() => {
            onOpen()
            setSearch('')
          }}
          mt={watch('categories').length > 0 || !!errors.categories ? 2 : 0}
        >
          Kategória hozzáadása
        </Button>
      </FormControl>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Kategória hozzáadása</ModalHeader>
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
              {...register('categories', {
                validate: (c: Category[]) => c.length > 0
              })}
              hidden
            />
            <VStack mb={2} maxHeight="500px" overflowY="auto">
              {isLoading || !filteredCategoryList || filteredCategoryList.length === 0 ? (
                <Text fontStyle="italic">Nincs találat</Text>
              ) : (
                filteredCategoryList.map((c) => (
                  <Box
                    borderRadius={6}
                    borderWidth={1}
                    p={2}
                    cursor="pointer"
                    key={c.id}
                    width="100%"
                    onClick={() => {
                      addCategory(c)
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

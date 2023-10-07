import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
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
  VStack,
} from '@chakra-ui/react'
import { CreateCategoryForm, Criterion } from '@pontozo/common'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FaCaretDown, FaCaretUp, FaMinus, FaSearch, FaTimes } from 'react-icons/fa'
import { useFetchCriteria } from '../../../api/hooks/criteriaHooks'
import { LoadingSpinner } from '../../../components/commons/LoadingSpinner'

export const CriteriaSelector = ({ editable }: { editable: boolean }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateCategoryForm>()

  const { isLoading, data: criteria } = useFetchCriteria()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState('')

  const addCriterion = (criterion: Criterion) => {
    setValue('criteria', [...watch('criteria'), criterion], { shouldValidate: true })
  }

  const removeCriterion = (criterion: Criterion) => {
    setValue(
      'criteria',
      watch('criteria').filter((c: Criterion) => c.id !== criterion.id),
      { shouldValidate: true }
    )
  }
  const moveCriterion = (idx: number, criterion: Criterion, delta: number) => {
    if ((idx === 0 && delta < 0) || (idx === watch('criteria').length - 1 && delta > 0)) {
      return
    }
    const newArray = watch('criteria').filter((c) => c.id !== criterion.id)
    newArray.splice(idx + delta, 0, criterion)
    setValue('criteria', newArray)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredCriterionList = criteria
    ?.filter((c1) => !watch('criteria').some((c2) => c1.id === c2.id))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <FormControl isInvalid={!!errors.criteria}>
        <FormLabel>Kategória szempontjai</FormLabel>
        <VStack w="100%" alignItems="flex-start" borderRadius={6} borderWidth={1} mb={2} p={2}>
          {watch('criteria').map((c, idx) => (
            <Box w="100%" borderRadius={6} borderWidth={1} key={c.id}>
              <HStack flexGrow={1} p={2}>
                <VStack alignItems="flex-start" flexGrow={1}>
                  <Text width="100%">{c.name}</Text>
                </VStack>
                <IconButton
                  aria-label="Szempont előrehozása"
                  size="xs"
                  isDisabled={idx === 0 ?? !editable}
                  icon={<FaCaretUp />}
                  colorScheme="brand"
                  onClick={() => moveCriterion(idx, c, -1)}
                />
                <IconButton
                  aria-label="Szempont hátrébb vitele"
                  size="xs"
                  isDisabled={idx === watch('criteria').length - 1 ?? !editable}
                  icon={<FaCaretDown />}
                  colorScheme="brand"
                  onClick={() => moveCriterion(idx, c, 1)}
                />
                <IconButton
                  aria-label="Szempont eltávolítása a kategóriából"
                  size="xs"
                  icon={<FaMinus />}
                  isDisabled={!editable}
                  colorScheme="red"
                  onClick={() => removeCriterion(c)}
                />
              </HStack>
            </Box>
          ))}
          {watch('criteria').length === 0 && (
            <Text fontStyle="italic" textAlign="center">
              Egy szempont sincs kiválasztva
            </Text>
          )}
        </VStack>
        <FormErrorMessage>Legalább egy szempontot válassz ki!</FormErrorMessage>
        <Button
          onClick={() => {
            onOpen()
            setSearch('')
          }}
          mt={watch('criteria').length > 0 || !!errors.criteria ? 2 : 0}
          isDisabled={!editable}
        >
          Szempont hozzáadása
        </Button>
      </FormControl>
      <Modal size="lg" scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Szempont hozzáadása</ModalHeader>
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
                validate: (c: Criterion[]) => c.length > 0,
              })}
              hidden
            />
            <VStack mb={2} maxHeight="500px" overflowY="auto">
              {isLoading || !filteredCriterionList || filteredCriterionList.length === 0 ? (
                <Text fontStyle="italic">Nincs találat</Text>
              ) : (
                filteredCriterionList.map((c) => (
                  <VStack
                    alignItems="flex-start"
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
                    <Heading size="xs" width="100%">
                      {c.name}
                    </Heading>
                    <HStack>
                      {c.seasons.map((s) => (
                        <Badge variant="solid" colorScheme="brand" key={s.id}>
                          {s.name}
                        </Badge>
                      ))}
                    </HStack>
                    <Text>{c.editorsNote}</Text>
                  </VStack>
                ))
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

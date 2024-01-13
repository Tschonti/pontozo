import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { CreateCategoryForm } from '@pontozo/common'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialogButton } from 'src/components/commons/ConfirmDialogButton'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useDuplicateCategoryMutation,
  useFetchCategory,
  useUpdateCategoryMutation,
} from '../../api/hooks/categoryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { CriteriaSelector } from './components/CriteriaSelector'

export const CategoryCreatePage = () => {
  const categoryId = parseInt(useParams<{ categoryId: string }>().categoryId ?? '-1')
  const { data, isLoading, isFetching, error } = useFetchCategory(categoryId)
  const categoryEditable = data?.editable ?? true

  const form = useForm<CreateCategoryForm>({
    values: {
      name: data?.name ?? '',
      description: data?.description ?? '',
      criteria: data?.criteria ?? [],
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form
  const navigate = useNavigate()
  const toast = useToast()
  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation(categoryId)
  const deleteMutation = useDeleteCategoryMutation(categoryId)
  const duplicateMutation = useDuplicateCategoryMutation(categoryId)

  const onSubmit: SubmitHandler<CreateCategoryForm> = ({ criteria, ...restOfData }) => {
    if (categoryId === -1) {
      createMutation.mutate({ ...restOfData, criterionIds: criteria.map((c) => c.id) }, { onSuccess: () => navigate(PATHS.CATEGORIES) })
    } else {
      updateMutation.mutate({ ...restOfData, criterionIds: criteria.map((c) => c.id) }, { onSuccess: () => navigate(PATHS.CATEGORIES) })
    }
  }

  const onDuplicateClick = () => {
    duplicateMutation.mutate(undefined, {
      onSuccess: (res) => {
        navigate(`${PATHS.CATEGORIES}/${res.id}/edit`)
        toast({ title: 'Kategória duplikálva!', description: 'Most már az újonnan létrejött kategóriát szerkeszted!', status: 'success' })
      },
    })
  }

  if (isLoading && isFetching) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  return (
    <VStack spacing={5} alignItems="flex-start">
      <HelmetTitle title="Pontoz-O Admin | Kategória szerkesztése" />
      <Heading>{categoryId === -1 ? 'Új kategória' : 'Kategória szerkesztése'}</Heading>

      {!categoryEditable && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Ez a kategória nem szerkeszthető, mert része egy olyan szezonnak, ami már elkezdődött!</AlertTitle>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Név</FormLabel>
        <Input {...register('name', { required: true, disabled: !categoryEditable })} bg="white" />
        <FormErrorMessage>Kötelező megadni a kategória nevét.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Publikus leírás</FormLabel>
        <Input {...register('description', { required: true, disabled: !categoryEditable })} bg="white" />
        <FormErrorMessage>Kötelező megadni a kategória leírását.</FormErrorMessage>
      </FormControl>
      <FormProvider {...form}>
        <CriteriaSelector editable={categoryEditable} />
      </FormProvider>

      <Flex width="100%" justifyContent="space-between">
        <Button as={Link} to={PATHS.CATEGORIES} leftIcon={<FaArrowLeft />}>
          Vissza
        </Button>
        <HStack spacing={1}>
          {categoryId > -1 && (
            <Button colorScheme="brand" onClick={onDuplicateClick}>
              Duplikálás
            </Button>
          )}
          {categoryId > -1 && (
            <ConfirmDialogButton
              confirmAction={() => deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.CATEGORIES) })}
              initiatorButtonText="Törlés"
              bodyText={`Biztosan a törlöd a(z) ${data?.name} kategóriát? Ezt az akciót nem lehet visszavonni!`}
              headerText="Biztosan törlöd a kategóriát?"
              initiatorButtonDisabled={!categoryEditable}
            />
          )}
          <Button type="submit" isDisabled={!categoryEditable} colorScheme="brand" onClick={handleSubmit(onSubmit)}>
            Mentés
          </Button>
        </HStack>
      </Flex>
    </VStack>
  )
}

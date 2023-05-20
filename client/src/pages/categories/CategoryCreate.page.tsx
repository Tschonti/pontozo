import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, VStack } from '@chakra-ui/react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategory,
  useUpdateCategoryMutation
} from '../../api/hooks/categoryHooks'
import { CreateCategoryForm } from '../../api/model/category'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { CriteriaSelector } from './components/CriteriaSelector'

export const CategoryCreatePage = () => {
  const categoryId = parseInt(useParams<{ categoryId: string }>().categoryId ?? '-1')
  const { data, isLoading, isFetching } = useFetchCategory(categoryId)

  const form = useForm<CreateCategoryForm>({
    values: {
      name: data?.name || '',
      description: data?.description || '',
      criteria: data?.criteria || []
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form
  const navigate = useNavigate()
  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation(categoryId)
  const deleteMutation = useDeleteCategoryMutation(categoryId)

  const onSubmit: SubmitHandler<CreateCategoryForm> = ({ criteria, ...restOfData }) => {
    if (categoryId === -1) {
      createMutation.mutate({ ...restOfData, criterionIds: criteria.map((c) => c.id) }, { onSuccess: () => navigate(PATHS.CATEGORIES) })
    } else {
      updateMutation.mutate({ ...restOfData, criterionIds: criteria.map((c) => c.id) }, { onSuccess: () => navigate(PATHS.CATEGORIES) })
    }
  }

  if (isLoading && isFetching) {
    return <LoadingSpinner />
  }
  return (
    <>
      <VStack spacing={5} alignItems="flex-start">
        <Heading>{categoryId === -1 ? 'Új kategória' : 'Kategória szerkesztése'}</Heading>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Név</FormLabel>
          <Input {...register('name', { required: true })} />
          <FormErrorMessage>Kötelező megadni a kategória nevét.</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Publikus leírás</FormLabel>
          <Input {...register('description', { required: true })} />
          <FormErrorMessage>Kötelező megadni a kategória leírását.</FormErrorMessage>
        </FormControl>
        <FormProvider {...form}>
          <CriteriaSelector />
        </FormProvider>

        <Flex width="100%" justifyContent="space-between">
          <Button as={Link} to={PATHS.CATEGORIES} leftIcon={<FaArrowLeft />}>
            Vissza
          </Button>
          <HStack spacing={1}>
            {categoryId > -1 && (
              <Button colorScheme="red" onClick={() => deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.CATEGORIES) })}>
                Kategória törlése
              </Button>
            )}
            <Button type="submit" colorScheme="green" onClick={handleSubmit(onSubmit)}>
              Mentés
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </>
  )
}

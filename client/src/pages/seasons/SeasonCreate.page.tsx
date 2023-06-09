import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Stack, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCreateSeasonMutation, useDeleteSeasonMutation, useFetchSeason, useUpdateSeasonMutation } from '../../api/hooks/seasonHooks'
import { CreateSeason, CreateSeasonForm } from '../../api/model/season'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { CategorySelector } from './components/CategorySelector'

export const SeasonCreatePage = () => {
  const seasonId = parseInt(useParams<{ seasonId: string }>().seasonId ?? '-1')
  const { data, isLoading, isFetching } = useFetchSeason(seasonId)
  const seasonEditable = new Date(data?.startDate ?? new Date(Date.now() + 1000)) > new Date()

  const form = useForm<CreateSeasonForm>({
    values: {
      name: data?.name || '',
      startDate: '',
      endDate: '',
      categories: data?.categories || []
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = form
  const navigate = useNavigate()
  const createMutation = useCreateSeasonMutation()
  const updateMutation = useUpdateSeasonMutation(seasonId)
  const deleteMutation = useDeleteSeasonMutation(seasonId)

  useEffect(() => {
    if (seasonId !== -1 && data && !isLoading) {
      const sd = new Date(data.startDate)
      const ed = new Date(data.endDate)
      const startStr = `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, '0')}-${String(sd.getDate()).padStart(2, '0')}`
      const endStr = `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, '0')}-${String(ed.getDate()).padStart(2, '0')}`

      setValue('startDate', startStr)
      setValue('endDate', endStr)
    }
  }, [data, isLoading])

  const onSubmit: SubmitHandler<CreateSeasonForm> = ({ categories, ...restOfData }) => {
    const data: CreateSeason = {
      ...restOfData,
      categoryIds: categories.map((c) => c.id)
    }
    if (seasonId === -1) {
      createMutation.mutate(data, { onSuccess: () => navigate(PATHS.SEASONS) })
    } else {
      updateMutation.mutate(data, { onSuccess: () => navigate(PATHS.SEASONS) })
    }
  }

  if (isLoading && isFetching) {
    return <LoadingSpinner />
  }
  return (
    <>
      <VStack spacing={5} alignItems="flex-start">
        <Heading>{seasonId === -1 ? 'Új szezon' : 'Szezon szerkesztése'}</Heading>
        {!seasonEditable && <Text>TODO ide valami szöveg hogy mért nem szerkeszthető</Text>}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Név</FormLabel>
          <Input {...register('name', { required: true, disabled: !seasonEditable })} />
          <FormErrorMessage>Kötelező megadni a szezon nevét.</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.startDate || !!errors.endDate}>
          <Stack direction={['column', 'column', 'row']} spacing={5} w="100%">
            <FormControl isInvalid={!!errors.startDate}>
              <FormLabel>Kezdő dátum</FormLabel>
              <Input
                type="date"
                {...register('startDate', {
                  disabled: !seasonEditable,
                  required: true,
                  validate: (sd, formValues) => new Date(sd) < new Date(formValues?.endDate),
                  deps: 'endDate'
                })}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.endDate}>
              <FormLabel>Befejező dátum</FormLabel>
              <Input
                type="date"
                {...register('endDate', {
                  disabled: !seasonEditable,
                  required: true,
                  validate: (ed, formValues) => new Date(ed) > new Date(formValues.startDate),
                  deps: 'startDate'
                })}
              />
            </FormControl>
          </Stack>
          <FormErrorMessage>A kezdő dátumnak előbb kell lennie, mint a befejező dátumnak!</FormErrorMessage>
        </FormControl>

        <FormProvider {...form}>
          <CategorySelector editable={seasonEditable} />
        </FormProvider>

        <Flex width="100%" justifyContent="space-between">
          <Button as={Link} to={PATHS.SEASONS} leftIcon={<FaArrowLeft />}>
            Vissza
          </Button>
          <HStack spacing={1}>
            {seasonId > -1 && (
              <Button
                colorScheme="red"
                isDisabled={!seasonEditable}
                onClick={() => deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.SEASONS) })}
              >
                Szezon törlése
              </Button>
            )}
            <Button type="submit" isDisabled={!seasonEditable} colorScheme="brand" onClick={handleSubmit(onSubmit)}>
              Mentés
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </>
  )
}

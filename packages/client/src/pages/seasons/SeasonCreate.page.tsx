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
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { CreateSeason, CreateSeasonForm } from '@pontozo/common'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialogButton } from 'src/components/commons/ConfirmDialogButton'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { onError } from 'src/util/onError'
import {
  useCreateSeasonMutation,
  useDeleteSeasonMutation,
  useDuplicateSeasonMutation,
  useFetchSeason,
  useUpdateSeasonMutation,
} from '../../api/hooks/seasonHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { CategorySelector } from './components/CategorySelector'

export default function () {
  const seasonId = parseInt(useParams<{ seasonId: string }>().seasonId ?? '-1')
  const { data, isLoading, isFetching, error } = useFetchSeason(seasonId)
  const seasonEditable = new Date(data?.startDate ?? new Date(Date.now() + 1000)) > new Date()
  const toast = useToast()

  const form = useForm<CreateSeasonForm>({
    values: {
      name: data?.name || '',
      startDate: '',
      endDate: '',
      categories: data?.categories || [],
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form
  const navigate = useNavigate()
  const createMutation = useCreateSeasonMutation()
  const updateMutation = useUpdateSeasonMutation(seasonId)
  const deleteMutation = useDeleteSeasonMutation(seasonId)
  const duplicateMutation = useDuplicateSeasonMutation(seasonId)

  useEffect(() => {
    if (seasonId !== -1 && data && !isLoading) {
      const sd = new Date(data.startDate)
      const ed = new Date(data.endDate)
      const startStr = `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, '0')}-${String(sd.getDate()).padStart(2, '0')}`
      const endStr = `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, '0')}-${String(ed.getDate()).padStart(2, '0')}`

      setValue('startDate', startStr)
      setValue('endDate', endStr)
    }
  }, [data, isLoading, seasonId, setValue])

  const onDuplicateClick = () => {
    duplicateMutation.mutate(undefined, {
      onSuccess: (res) => {
        navigate(`${PATHS.SEASONS}/${res.id}/edit`)
        toast({ title: 'Szezon duplikálva!', description: 'Most már az újonnan létrejött szezont szerkeszted!', status: 'success' })
      },
    })
  }

  if (isLoading && isFetching) {
    return <LoadingSpinner />
  }

  if (error) {
    return <NavigateWithError error={error} to={PATHS.SEASONS} />
  }

  const onSubmit: SubmitHandler<CreateSeasonForm> = ({ categories, ...restOfData }) => {
    const data: CreateSeason = {
      ...restOfData,
      startDate: new Date(restOfData.startDate),
      endDate: new Date(restOfData.endDate),
      categoryIds: categories.map((c) => c.id),
    }
    if (seasonId === -1) {
      createMutation.mutate(data, { onSuccess: () => navigate(PATHS.SEASONS), onError: (e) => onError(e, toast) })
    } else {
      updateMutation.mutate(data, { onSuccess: () => navigate(PATHS.SEASONS), onError: (e) => onError(e, toast) })
    }
  }

  return (
    <VStack spacing={5} alignItems="flex-start">
      <HelmetTitle title="Pontoz-O Admin | Szezon szerkesztése" />
      <Heading>{seasonId === -1 ? 'Új szezon' : 'Szezon szerkesztése'}</Heading>

      {!seasonEditable && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Ez a szezon nem szerkeszthető, mert már elkezdődött!</AlertTitle>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Név</FormLabel>
        <Input {...register('name', { required: true, disabled: !seasonEditable })} bg="white" />
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
                deps: 'endDate',
              })}
              bg="white"
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
                deps: 'startDate',
              })}
              bg="white"
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
            <Button colorScheme="brand" onClick={onDuplicateClick}>
              Duplikálás
            </Button>
          )}
          {seasonId > -1 && (
            <ConfirmDialogButton
              confirmAction={() =>
                deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.SEASONS), onError: (e) => onError(e, toast) })
              }
              initiatorButtonText="Törlés"
              bodyText={`Biztosan a törlöd a(z) ${data?.name} szezont? Ezt az akciót nem lehet visszavonni!`}
              headerText="Biztosan törlöd a szezont?"
              initiatorButtonDisabled={!seasonEditable}
            />
          )}
          <Button type="submit" isDisabled={!seasonEditable} colorScheme="brand" onClick={handleSubmit(onSubmit)}>
            Mentés
          </Button>
        </HStack>
      </Flex>
    </VStack>
  )
}

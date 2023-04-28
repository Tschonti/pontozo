import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  VStack
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCreateCriterionMutation, useDeleteCriterionMutation, useUpdateCriterionMutation } from '../../api/hooks/criteriaMutationHook'
import { useFetchCriterion } from '../../api/hooks/criteriaQueryHook'
import { CreateCriterion } from '../../api/model/criterion'
import { RatingRole } from '../../api/model/rating'
import { onlyUnique } from '../../util/onlyUnique'
import { PATHS } from '../../util/paths'

export const CriteriaCreatePage = () => {
  const criterionId = parseInt(useParams<{ criterionId: string }>().criterionId ?? '-1')
  const criterionQuery = useFetchCriterion(criterionId, (data) => {
    setValue('name', data.name)
    setValue('description', data.description)
    setValue('text0', data.text0)
    setValue('text1', data.text1)
    setValue('text2', data.text2)
    setValue('text3', data.text3)
    setValue('editorsNote', data.editorsNote)
    setValue('competitorWeight', data.competitorWeight)
    setValue('organiserWeight', data.organiserWeight)
    setValue('stageSpecific', data.stageSpecific)
    setValue('nationalOnly', data.nationalOnly)
    setValue('roles', data.roles)
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateCriterion>({
    defaultValues: {
      text0: 'Rossz',
      text1: 'Gyenge',
      text2: 'Megfelelő',
      text3: 'Kiváló',
      nationalOnly: false,
      stageSpecific: false,
      roles: []
    }
  })
  const navigate = useNavigate()
  const createMutation = useCreateCriterionMutation()
  const updateMutation = useUpdateCriterionMutation(criterionId)
  const deleteMutation = useDeleteCriterionMutation(criterionId)

  const onSubmit: SubmitHandler<CreateCriterion> = (formData) => {
    if (criterionId === -1) {
      createMutation.mutate(formData, { onSuccess: () => navigate(PATHS.CRITERIA) })
    } else {
      updateMutation.mutate(formData, { onSuccess: () => navigate(PATHS.CRITERIA) })
    }
  }

  const generateChangeFn = (values: RatingRole[]) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setValue('roles', [...watch('roles'), ...values].filter(onlyUnique), { shouldValidate: true })
      } else {
        setValue(
          'roles',
          watch('roles')
            .filter((v) => !values.includes(v))
            .filter(onlyUnique),
          { shouldValidate: true }
        )
      }
    }
  }

  if (criterionQuery.isLoading) {
    return <Spinner />
  }
  return (
    <>
      <VStack spacing={5} alignItems="flex-start">
        <Heading>{criterionId === -1 ? 'Új szempont' : 'Szempont szerkesztése'}</Heading>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Név</FormLabel>
          <Input {...register('name', { required: true })} />
          <FormErrorMessage>Kötelező megadni a szempont nevét.</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Publikus leírás</FormLabel>
          <Input {...register('description', { required: true })} />
          <FormErrorMessage>Kötelező megadni a szempont leírását.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.editorsNote}>
          <FormLabel>Privát leírás</FormLabel>
          <Input {...register('editorsNote')} />
        </FormControl>
        <Stack direction={['column', 'column', 'row']} spacing={5} w="100%">
          <FormControl isInvalid={!!errors.text0}>
            <FormLabel>0 jelentése</FormLabel>
            <Input {...register('text0')} />
          </FormControl>
          <FormControl isInvalid={!!errors.text1}>
            <FormLabel>1 jelentése</FormLabel>
            <Input {...register('text1')} />
          </FormControl>
        </Stack>

        <Stack direction={['column', 'column', 'row']} spacing={5} w="100%">
          <FormControl isInvalid={!!errors.text2}>
            <FormLabel>2 jelentése</FormLabel>
            <Input {...register('text2')} />
          </FormControl>
          <FormControl isInvalid={!!errors.text3}>
            <FormLabel>3 jelentése</FormLabel>
            <Input {...register('text3')} />
          </FormControl>
        </Stack>

        <SimpleGrid columns={[1, 1, 2]} spacing={10}>
          <FormControl isInvalid={!!errors.roles}>
            <FormLabel>Szerepkörök, akik számára elérhető</FormLabel>
            <Input {...register('roles', { validate: (v) => v.length > 0 })} hidden />
            <VStack alignItems="flex-start">
              <Checkbox
                colorScheme="green"
                defaultChecked={watch('roles').includes(RatingRole.COMPETITOR)}
                onChange={generateChangeFn([RatingRole.COMPETITOR, RatingRole.COACH])}
              >
                Versenyzők és Edzők
              </Checkbox>
              <Checkbox
                colorScheme="green"
                defaultChecked={watch('roles').includes(RatingRole.JURY)}
                onChange={generateChangeFn([RatingRole.ORGANISER, RatingRole.JURY])}
              >
                Rendezők és MTFSZ Zsűrik
              </Checkbox>
            </VStack>

            <FormErrorMessage>Kötelező legalább egy szerepkört kiválasztani.</FormErrorMessage>
          </FormControl>

          <VStack>
            <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="stageSpecific" mb="0">
                Futam specifikus
              </FormLabel>
              <Switch
                checked={watch('stageSpecific')}
                colorScheme="green"
                id="stageSpecific"
                onChange={(e) => setValue('stageSpecific', e.target.checked)}
              />
            </FormControl>
            <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="nationalOnly" mb="0">
                Csak országos/kiemelt versenyekre érvényes
              </FormLabel>
              <Switch
                checked={watch('nationalOnly')}
                colorScheme="green"
                id="nationalOnly"
                onChange={(e) => setValue('nationalOnly', e.target.checked)}
              />
            </FormControl>
          </VStack>
        </SimpleGrid>

        <SimpleGrid columns={[1, 1, 2]} spacing={5} w="100%">
          {watch('roles').includes(RatingRole.COMPETITOR) && (
            <FormControl isInvalid={!!errors.competitorWeight}>
              <FormLabel>Versenyző/Edző értékelés súlya</FormLabel>
              <Input
                type="number"
                {...register('competitorWeight', {
                  valueAsNumber: true,
                  validate: (val, formVal) => !formVal.roles.includes(RatingRole.COMPETITOR) || val > 0,
                  deps: ['roles']
                })}
              />
              <FormErrorMessage>Kötelező megadni a szempont súlyát a szerepkörhöz.</FormErrorMessage>
            </FormControl>
          )}
          {watch('roles').includes(RatingRole.ORGANISER) && (
            <FormControl isInvalid={!!errors.organiserWeight}>
              <FormLabel>Rendező/Zsűri értékelés súlya</FormLabel>
              <Input
                type="number"
                {...register('organiserWeight', {
                  valueAsNumber: true,
                  validate: (val, formVal) => !formVal.roles.includes(RatingRole.ORGANISER) || val > 0,
                  deps: ['roles']
                })}
              />
              <FormErrorMessage>Kötelező megadni a szempont súlyát a szerepkörhöz.</FormErrorMessage>
            </FormControl>
          )}
        </SimpleGrid>

        <Flex width="100%" justifyContent="space-between">
          <Button as={Link} to={PATHS.CRITERIA} leftIcon={<FaArrowLeft />}>
            Vissza
          </Button>
          <HStack spacing={1}>
            {criterionId > -1 && (
              <Button colorScheme="red" onClick={() => deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.CRITERIA) })}>
                Szempont törlése
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

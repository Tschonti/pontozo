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
  Stack,
  Switch,
  VStack
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useCreateCriterionMutation,
  useDeleteCriterionMutation,
  useFetchCriterion,
  useUpdateCriterionMutation
} from '../../api/hooks/criteriaHooks'
import { CreateCriterion, CreateCriterionForm } from '../../api/model/criterion'
import { RatingRole } from '../../api/model/rating'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'

export const CriteriaCreatePage = () => {
  const criterionId = parseInt(useParams<{ criterionId: string }>().criterionId ?? '-1')
  const { data, isLoading, isFetching } = useFetchCriterion(criterionId)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateCriterionForm>({
    values: {
      name: data?.name || '',
      description: data?.description || '',
      editorsNote: data?.editorsNote || '',
      text0: data?.text0 || 'Rossz',
      text1: data?.text1 || 'Gyenge',
      text2: data?.text2 || 'Megfelelő',
      text3: data?.text3 || 'Kiváló',
      competitorWeight: data?.competitorWeight || 1,
      organiserWeight: data?.organiserWeight || 1,
      stageSpecific: !!data?.stageSpecific,
      nationalOnly: !!data?.nationalOnly,
      allowEmpty: !!data?.allowEmpty,
      competitorAllowed: !!data?.roles.includes(RatingRole.COMPETITOR),
      juryAllowed: !!data?.roles.includes(RatingRole.JURY)
    }
  })
  const navigate = useNavigate()
  const createMutation = useCreateCriterionMutation()
  const updateMutation = useUpdateCriterionMutation(criterionId)
  const deleteMutation = useDeleteCriterionMutation(criterionId)

  const onSubmit: SubmitHandler<CreateCriterionForm> = ({ competitorAllowed, juryAllowed, ...restOfData }) => {
    const roles: RatingRole[] = []
    if (competitorAllowed) {
      roles.push(RatingRole.COMPETITOR)
      roles.push(RatingRole.COACH)
    }
    if (juryAllowed) {
      roles.push(RatingRole.JURY)
      roles.push(RatingRole.ORGANISER)
    }

    const data: CreateCriterion = {
      ...restOfData,
      competitorWeight: competitorAllowed ? restOfData.competitorWeight : undefined,
      organiserWeight: juryAllowed ? restOfData.organiserWeight : undefined,
      roles
    }
    if (criterionId === -1) {
      createMutation.mutate(data, { onSuccess: () => navigate(PATHS.CRITERIA) })
    } else {
      updateMutation.mutate(data, { onSuccess: () => navigate(PATHS.CRITERIA) })
    }
  }

  if (isLoading && isFetching) {
    return <LoadingSpinner />
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
        {/* TODO listából érkezve első alkalommal a checkbox értékek nem frissek!  */}
        <SimpleGrid columns={[1, 1, 2]} spacing={10}>
          <FormControl isInvalid={!!errors.competitorAllowed}>
            <FormLabel>Szerepkörök, akik számára elérhető</FormLabel>
            <VStack alignItems="flex-start">
              <Checkbox
                colorScheme="brand"
                {...register('competitorAllowed', {
                  validate: (val, formVal) => val || formVal.juryAllowed,
                  deps: 'juryAllowed'
                })}
              >
                Versenyzők és Edzők
              </Checkbox>
              <Checkbox
                colorScheme="brand"
                {...register('juryAllowed', {
                  validate: (val, formVal) => val || formVal.competitorAllowed,
                  deps: 'competitorAllowed'
                })}
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
              <Switch {...register('stageSpecific')} colorScheme="brand" id="stageSpecific" />
            </FormControl>
            <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="nationalOnly" mb="0">
                Csak országos/kiemelt versenyekre érvényes
              </FormLabel>
              <Switch {...register('nationalOnly')} colorScheme="brand" id="nationalOnly" />
            </FormControl>
            <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
              <FormLabel htmlFor="allowEmpty" mb="0">
                "Nem tudom" válasz engedett
              </FormLabel>
              <Switch {...register('allowEmpty')} colorScheme="brand" id="allowEmpty" />
            </FormControl>
          </VStack>
        </SimpleGrid>

        <SimpleGrid columns={[1, 1, 2]} spacing={5} w="100%">
          {watch('competitorAllowed') && (
            <FormControl isInvalid={!!errors.competitorWeight}>
              <FormLabel>Versenyző/Edző értékelés súlya</FormLabel>
              <Input
                type="number"
                {...register('competitorWeight', {
                  valueAsNumber: true,
                  validate: (val, formVal) => !formVal.competitorAllowed || val > 0,
                  deps: ['competitorAllowed']
                })}
              />
              <FormErrorMessage>Kötelező megadni a szempont súlyát a szerepkörhöz.</FormErrorMessage>
            </FormControl>
          )}
          {watch('juryAllowed') && (
            <FormControl isInvalid={!!errors.organiserWeight}>
              <FormLabel>Rendező/Zsűri értékelés súlya</FormLabel>
              <Input
                type="number"
                {...register('organiserWeight', {
                  valueAsNumber: true,
                  validate: (val, formVal) => !formVal.juryAllowed || val > 0,
                  deps: ['juryAllowed']
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
            <Button type="submit" colorScheme="brand" onClick={handleSubmit(onSubmit)}>
              Mentés
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </>
  )
}

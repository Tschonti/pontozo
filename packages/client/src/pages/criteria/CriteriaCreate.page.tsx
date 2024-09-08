import {
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
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
  useToast,
  VStack,
} from '@chakra-ui/react'
import { CreateCriteria, CreateCriterionForm, RatingRole } from '@pontozo/common'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialogButton } from 'src/components/commons/ConfirmDialogButton'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import {
  useCreateCriterionMutation,
  useDeleteCriterionMutation,
  useDuplicateCriterionMutation,
  useFetchCriterion,
  useUpdateCriterionMutation,
} from '../../api/hooks/criteriaHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'

export default function () {
  const criterionId = parseInt(useParams<{ criterionId: string }>().criterionId ?? '-1')
  const { data, isLoading, isFetching, error } = useFetchCriterion(criterionId)
  const criterionEditable = data?.editable ?? true

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCriterionForm>({
    values: {
      name: data?.name || '',
      description: data?.description || '',
      editorsNote: data?.editorsNote || '',
      text0: data?.text0 || 'Rossz',
      text1: data?.text1 || 'Gyenge',
      text2: data?.text2 || 'Megfelelő',
      text3: data?.text3 || 'Kiváló',
      competitorWeight: data?.competitorWeight || 0,
      organiserWeight: data?.organiserWeight || 0,
      stageSpecific: !!data?.stageSpecific,
      nationalOnly: !!data?.nationalOnly,
      allowEmpty: !!data?.allowEmpty,
      competitorAllowed: !!data?.roles.includes(RatingRole.COMPETITOR),
      juryAllowed: !!data?.roles.includes(RatingRole.JURY),
    },
  })
  const navigate = useNavigate()
  const toast = useToast()
  const createMutation = useCreateCriterionMutation()
  const updateMutation = useUpdateCriterionMutation(criterionId)
  const deleteMutation = useDeleteCriterionMutation(criterionId)
  const duplicateMutation = useDuplicateCriterionMutation(criterionId)

  if (isLoading && isFetching) {
    return <LoadingSpinner />
  }
  if (error) {
    return <NavigateWithError error={error} to={PATHS.CRITERIA} />
  }

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

    const data: CreateCriteria = {
      ...restOfData,
      competitorWeight: competitorAllowed ? restOfData.competitorWeight : undefined,
      organiserWeight: juryAllowed ? restOfData.organiserWeight : undefined,
      roles,
    }
    if (criterionId === -1) {
      createMutation.mutate(data, { onSuccess: () => navigate(PATHS.CRITERIA) })
    } else {
      updateMutation.mutate(data, { onSuccess: () => navigate(PATHS.CRITERIA) })
    }
  }

  const onDuplicateClick = () => {
    duplicateMutation.mutate(undefined, {
      onSuccess: (res) => {
        navigate(`${PATHS.CRITERIA}/${res[0].id}/edit`)
        toast({ title: 'Szempont duplikálva!', description: 'Most már az újonnan létrejött szempontot szerkeszted!', status: 'success' })
      },
    })
  }

  return (
    <VStack spacing={5} alignItems="flex-start">
      <HelmetTitle title="Pontoz-O Admin | Szempont szerkesztése" />
      <HStack w="100%" justify="space-between">
        <Heading>{criterionId === -1 ? 'Új szempont' : 'Szempont szerkesztése'}</Heading>
        <HStack>
          {data?.seasons.map((s) => (
            <Badge fontSize="xl" variant="solid" colorScheme="brand" key={s.id}>
              {s.name}
            </Badge>
          ))}
        </HStack>
      </HStack>

      {!criterionEditable && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Ez a szempont nem szerkeszthető, mert része egy olyan szezonnak, ami már elkezdődött!</AlertTitle>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Név</FormLabel>
        <Input {...register('name', { required: true, disabled: !criterionEditable })} bg="white" />
        <FormErrorMessage>Kötelező megadni a szempont nevét.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Publikus leírás</FormLabel>
        <Input {...register('description', { required: true, disabled: !criterionEditable })} bg="white" />
        <FormErrorMessage>Kötelező megadni a szempont leírását.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.editorsNote}>
        <FormLabel>Privát leírás</FormLabel>
        <Input {...register('editorsNote', { disabled: !criterionEditable })} bg="white" />
      </FormControl>
      <Stack direction={['column', 'column', 'row']} spacing={5} w="100%">
        <FormControl isInvalid={!!errors.text0}>
          <FormLabel>0 jelentése</FormLabel>
          <Input {...register('text0', { disabled: !criterionEditable })} bg="white" />
        </FormControl>
        <FormControl isInvalid={!!errors.text1}>
          <FormLabel>1 jelentése</FormLabel>
          <Input {...register('text1', { disabled: !criterionEditable })} bg="white" />
        </FormControl>
      </Stack>

      <Stack direction={['column', 'column', 'row']} spacing={5} w="100%">
        <FormControl isInvalid={!!errors.text2}>
          <FormLabel>2 jelentése</FormLabel>
          <Input {...register('text2', { disabled: !criterionEditable })} bg="white" />
        </FormControl>
        <FormControl isInvalid={!!errors.text3}>
          <FormLabel>3 jelentése</FormLabel>
          <Input {...register('text3', { disabled: !criterionEditable })} bg="white" />
        </FormControl>
      </Stack>
      {/* TODO listából érkezve első alkalommal a checkbox értékek nem frissek!  */}
      <SimpleGrid columns={[1, 1, 2]} spacing={10}>
        <FormControl isInvalid={!!errors.competitorAllowed}>
          <FormLabel htmlFor="">Szerepkörök, akik számára elérhető</FormLabel>
          <VStack alignItems="flex-start">
            <Checkbox
              colorScheme="brand"
              {...register('competitorAllowed', {
                disabled: !criterionEditable,
                validate: (val, formVal) => val || formVal.juryAllowed,
                deps: 'juryAllowed',
              })}
            >
              Versenyzők és Edzők
            </Checkbox>
            <Checkbox
              colorScheme="brand"
              {...register('juryAllowed', {
                disabled: !criterionEditable,
                validate: (val, formVal) => val || formVal.competitorAllowed,
                deps: 'competitorAllowed',
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
            <Switch {...register('stageSpecific', { disabled: !criterionEditable })} colorScheme="brand" id="stageSpecific" />
          </FormControl>
          <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
            <FormLabel htmlFor="nationalOnly" mb="0">
              Csak országos/kiemelt versenyekre érvényes
            </FormLabel>
            <Switch {...register('nationalOnly', { disabled: !criterionEditable })} colorScheme="brand" id="nationalOnly" />
          </FormControl>
          <FormControl display="flex" w="100%" justifyContent="space-between" alignItems="center">
            <FormLabel htmlFor="allowEmpty" mb="0">
              "Nem tudom" válasz engedett
            </FormLabel>
            <Switch {...register('allowEmpty', { disabled: !criterionEditable })} colorScheme="brand" id="allowEmpty" />
          </FormControl>
        </VStack>
      </SimpleGrid>

      <SimpleGrid columns={[1, 1, 2]} spacing={5} w="100%">
        {(watch('competitorAllowed') || !criterionEditable) && (
          <FormControl isInvalid={!!errors.competitorWeight}>
            <FormLabel>Versenyző/Edző értékelés súlya</FormLabel>
            <Input
              type="number"
              {...register('competitorWeight', {
                disabled: !criterionEditable,
                valueAsNumber: true,
                validate: (val, formVal) => !formVal.competitorAllowed || val > 0,
                deps: ['competitorAllowed'],
              })}
              bg="white"
            />
            <FormErrorMessage>Kötelező megadni a szempont súlyát a szerepkörhöz.</FormErrorMessage>
          </FormControl>
        )}
        {(watch('juryAllowed') || !criterionEditable) && (
          <FormControl isInvalid={!!errors.organiserWeight}>
            <FormLabel>Rendező/Zsűri értékelés súlya</FormLabel>
            <Input
              type="number"
              {...register('organiserWeight', {
                disabled: !criterionEditable,
                valueAsNumber: true,
                validate: (val, formVal) => !formVal.juryAllowed || val > 0,
                deps: ['juryAllowed'],
              })}
              bg="white"
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
            <Button colorScheme="brand" onClick={onDuplicateClick}>
              Duplikálás
            </Button>
          )}
          {criterionId > -1 && (
            <ConfirmDialogButton
              confirmAction={() => deleteMutation.mutate(undefined, { onSuccess: () => navigate(PATHS.CRITERIA) })}
              initiatorButtonText="Törlés"
              bodyText={`Biztosan a törlöd a(z) ${data?.name} szempontot? Ezt az akciót nem lehet visszavonni!`}
              headerText="Biztosan törlöd a szempontot?"
              initiatorButtonDisabled={!criterionEditable}
            />
          )}
          <Button type="submit" isDisabled={!criterionEditable} colorScheme="brand" onClick={handleSubmit(onSubmit)}>
            Mentés
          </Button>
        </HStack>
      </Flex>
    </VStack>
  )
}

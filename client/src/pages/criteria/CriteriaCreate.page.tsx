import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, VStack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateCriterionMutation } from '../../api/hooks/criteriaMutationHook'
import { CreateCriterion } from '../../api/model/criterion'
import { RatingRole } from '../../api/model/rating'
import { onlyUnique } from '../../util/onlyUnique'
import { PATHS } from '../../util/paths'
import { ratingRolesArray, translateRole } from '../../util/ratingRoleHelpers'

export const CriteriaCreatePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateCriterion>()
  const navigate = useNavigate()
  const createMutation = useCreateCriterionMutation()
  const onSubmit: SubmitHandler<CreateCriterion> = (formData) => {
    createMutation.mutate(formData, { onSuccess: () => navigate(PATHS.CRITERIA) })
  }

  const generateChangeFn = (value: RatingRole) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setValue('roles', [...watch('roles'), value].filter(onlyUnique), { shouldValidate: true })
      } else {
        setValue(
          'roles',
          watch('roles')
            .filter((v) => v !== value)
            .filter(onlyUnique),
          { shouldValidate: true }
        )
      }
    }
  }
  return (
    <>
      <VStack spacing={5} alignItems="flex-start">
        <Heading>Új szempont</Heading>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Név</FormLabel>
          <Input {...register('name', { required: true })} />
          <FormErrorMessage>Kötelező megadni a szempont nevét.</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Leírás</FormLabel>
          <Input {...register('description', { required: true })} />
          <FormErrorMessage>Kötelező megadni a szempont leírását.</FormErrorMessage>
        </FormControl>
        <HStack spacing={5} w="100%">
          <FormControl isInvalid={!!errors.minValue}>
            <FormLabel>Minimum érték</FormLabel>
            <Input
              type="number"
              {...register('minValue', {
                validate: (_, data) => data.minValue < data.maxValue,
                required: true,
                deps: ['maxValue'],
                valueAsNumber: true
              })}
            />
            <FormErrorMessage>A minimum értéknek a maximum értéknél kisebbnek kell lennie.</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.maxValue}>
            <FormLabel>Maximum érték</FormLabel>
            <Input
              type="number"
              {...register('maxValue', {
                validate: (_, data) => data.minValue < data.maxValue,
                required: true,
                deps: ['minValue'],
                valueAsNumber: true
              })}
            />
            <FormErrorMessage>A maximum értéknek a minimum értéknél nagyobbnak kell lennie.</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.weight}>
          <FormLabel>Súly</FormLabel>
          <Input type="number" {...register('weight', { required: true, valueAsNumber: true })} />
          <FormErrorMessage>Kötelező megadni a szempont súlyát.</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.roles}>
          <FormLabel>Szerepkörök, akik számára elérhető</FormLabel>
          <Input {...register('roles', { validate: (v) => v.length > 0 })} hidden />
          <VStack alignItems="flex-start">
            {ratingRolesArray.map((r) => (
              <Checkbox key={r} onChange={generateChangeFn(r)}>
                {translateRole[r]}
              </Checkbox>
            ))}
          </VStack>

          <FormErrorMessage>Kötelező legalább egy szerepkört kiválasztani.</FormErrorMessage>
        </FormControl>

        <Flex width="100%" justifyContent="space-between">
          <Button as={Link} to={PATHS.CRITERIA} leftIcon={<FaArrowLeft />}>
            Vissza
          </Button>
          <Button type="submit" colorScheme="green" onClick={handleSubmit(onSubmit)}>
            Mentés
          </Button>
        </Flex>
      </VStack>
    </>
  )
}

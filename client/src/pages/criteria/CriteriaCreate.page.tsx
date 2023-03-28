import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, VStack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateCriterionMutation } from '../../api/hooks/criteriaMutationHook'
import { CreateCriterion } from '../../api/model/criterion'
import { PATHS } from '../../util/paths'

export const CriteriaCreatePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateCriterion>()
  const navigate = useNavigate()
  const createMutation = useCreateCriterionMutation()
  const onSubmit: SubmitHandler<CreateCriterion> = (formData) => {
    createMutation.mutate(formData, { onSuccess: (data) => navigate(`${PATHS.CRITERIA}/${data[0].id}`) })
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
          <Input type="number" {...register('weight', { required: true })} />
          <FormErrorMessage>Kötelező megadni a szempont súlyát.</FormErrorMessage>
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

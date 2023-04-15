import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FUNC_HOST } from '../../util/environment'
import { CreateCriterion } from '../model/criterion'

export type CreateResponse = {
  id: number
}

export const useRateCriteriaMutation = (ratingId: number, criterionId: number) => {
  return useMutation<unknown, Error, number>(
    async (value) => (await axios.post(`${FUNC_HOST}/ratings/${ratingId}`, { value, criterionId })).data
  )
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], Error, CreateCriterion>(
    async (formData) => (await axios.post(`${FUNC_HOST}/criteria`, formData)).data
  )
}

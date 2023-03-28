import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_HOST } from '../../util/environment'
import { CreateCriterion, Criterion } from '../model/criterion'
import { Rating } from '../model/rating'

export type CreateResponse = {
  id: number
}

export const useRateCriteriaMutation = (criterionId: number) => {
  return useMutation<Rating, Error, number>(async (value) => (await axios.post(`${API_HOST}/criteria/${criterionId}/rate`, { value })).data)
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], Error, CreateCriterion>(
    async (formData) => (await axios.post(`${API_HOST}/criteria`, formData)).data
  )
}

import { useMutation } from '@tanstack/react-query'
import { functionAxios } from '../../util/initAxios'
import { CreateCriterion } from '../model/criterion'

export type CreateResponse = {
  id: number
}

type CreateCriterionRatingMutation = {
  eventRatingId: number
  criterionId: number
  stageId?: number
}

export const useRateCriteriaMutation = ({ eventRatingId, criterionId, stageId }: CreateCriterionRatingMutation) => {
  return useMutation<unknown, Error, number>(
    async (value) => (await functionAxios.post(`/ratings/${eventRatingId}`, { value, criterionId, stageId })).data
  )
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], Error, CreateCriterion>(async (formData) => (await functionAxios.post(`/criteria`, formData)).data)
}

export const useUpdateCriterionMutation = (criterionId: number) => {
  return useMutation<CreateResponse[], Error, CreateCriterion>(
    async (formData) => (await functionAxios.put(`/criteria/${criterionId}`, formData)).data
  )
}

export const useDeleteCriterionMutation = (criterionId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/criteria/${criterionId}`)).data)
}

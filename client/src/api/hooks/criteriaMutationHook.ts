import { useMutation } from '@tanstack/react-query'
import { FUNC_HOST } from '../../util/environment'
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
    async (value) => (await functionAxios.post(`${FUNC_HOST}/ratings/${eventRatingId}`, { value, criterionId, stageId })).data
  )
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], Error, CreateCriterion>(
    async (formData) => (await functionAxios.post(`${FUNC_HOST}/criteria`, formData)).data
  )
}

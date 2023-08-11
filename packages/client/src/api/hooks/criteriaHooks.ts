import {
  CreateCriteria,
  CreateCriterionRating,
  CreateResponse,
  CriterionWithSeason,
  EntityWithEditableIndicator,
  PontozoError,
} from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/axiosConfig'

export const useFetchCriteria = () => {
  return useQuery<CriterionWithSeason[], PontozoError>(['fetchCriteria'], async () => (await functionAxios.get(`/criteria`)).data, {
    retry: false,
  })
}

export const useFetchCriterion = (criterionId: number) => {
  return useQuery<EntityWithEditableIndicator<CriterionWithSeason>, PontozoError>(
    ['fetchCriterion', criterionId],
    async () => (await functionAxios.get(`/criteria/${criterionId}`)).data,
    {
      retry: false,
      refetchInterval: false,
      enabled: criterionId > 0,
    }
  )
}

export const useRateCriteriaMutation = (eventRatingId: number) => {
  return useMutation<Record<string, never>, PontozoError, CreateCriterionRating>(
    async (ratingData) => (await functionAxios.post(`/ratings/${eventRatingId}`, ratingData)).data
  )
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], PontozoError, CreateCriteria>(
    async (formData) => (await functionAxios.post(`/criteria`, formData)).data
  )
}

export const useUpdateCriterionMutation = (criterionId: number) => {
  return useMutation<CreateResponse[], PontozoError, CreateCriteria>(
    async (formData) => (await functionAxios.put(`/criteria/${criterionId}`, formData)).data
  )
}

export const useDeleteCriterionMutation = (criterionId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/criteria/${criterionId}`)).data)
}

export const useDuplicateCriterionMutation = (criterionId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.post(`/criteria/${criterionId}/duplicate`)).data)
}

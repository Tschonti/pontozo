import {
  CreateCriterionWeight,
  CreateResponse,
  CreateSeason,
  PontozoError,
  Season,
  SeasonWithCategories,
  SeasonWithCriterionWeights,
} from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from 'src/util/queryClient'
import { functionAxios } from '../../util/axiosConfig'

export const useFetchSeasons = () => {
  return useQuery<Season[], PontozoError>(['fetchSeasons'], async () => (await functionAxios.get(`/seasons`)).data, { retry: false })
}

export const useFetchSeason = (seasonId: number) => {
  return useQuery<SeasonWithCategories, PontozoError>(
    ['fetchSeason', seasonId],
    async () => (await functionAxios.get(`/seasons/${seasonId}`)).data,
    {
      retry: false,
      refetchInterval: false,
      enabled: seasonId > 0,
    }
  )
}

export const useFetchSeasonWeights = (seasonId?: string) => {
  return useQuery<SeasonWithCriterionWeights, PontozoError>(
    ['fetchSeasonWeights', seasonId],
    async () => (await functionAxios.get(`/seasons/${seasonId}/weights`)).data,
    {
      retry: false,
      refetchInterval: false,
      enabled: !!seasonId,
    }
  )
}

export const useSetWeightsMutations = (seasonId: string, criterionId: number) => {
  return useMutation<unknown, PontozoError, CreateCriterionWeight>(
    async (formdata) => await functionAxios.put(`/seasons/${seasonId}/weights/${criterionId}`, formdata),
    { onSuccess: () => queryClient.invalidateQueries(['fetchSeasonWeights', seasonId]) }
  )
}

export const useCopyWeightsMutations = (destSeasonId: string) => {
  return useMutation<unknown, PontozoError, string>(
    async (sourceSeasonId) => await functionAxios.put(`/seasons/${destSeasonId}/copyWeights/${sourceSeasonId}`)
  )
}

export const useCreateSeasonMutation = () => {
  return useMutation<CreateResponse[], PontozoError, CreateSeason>(
    async (formData) => (await functionAxios.post(`/seasons`, formData)).data
  )
}

export const useUpdateSeasonMutation = (seasonId: number) => {
  return useMutation<CreateResponse[], PontozoError, CreateSeason>(
    async (formData) => (await functionAxios.put(`/seasons/${seasonId}`, formData)).data
  )
}

export const useDeleteSeasonMutation = (seasonId: number) => {
  return useMutation<CreateResponse[], PontozoError>(async () => (await functionAxios.delete(`/seasons/${seasonId}`)).data)
}

export const useDuplicateSeasonMutation = (seasonId: number) => {
  return useMutation<Season, Error>(async () => (await functionAxios.post(`/seasons/${seasonId}/duplicate`)).data)
}

import { CreateResponse, CreateSeason, PontozoError, Season, SeasonWithCategories } from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
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

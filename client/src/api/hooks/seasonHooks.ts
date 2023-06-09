import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/initAxios'
import { CreateSeason, Season, SeasonDetails } from '../model/season'
import { CreateResponse } from './categoryHooks'

export const useFetchSeasons = () => {
  return useQuery<Season[]>(['fetchSeasons'], async () => (await functionAxios.get(`/seasons`)).data, { retry: false })
}

export const useFetchSeason = (seasonId: number) => {
  return useQuery<SeasonDetails>(['fetchSeason', seasonId], async () => (await functionAxios.get(`/seasons/${seasonId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: seasonId > 0
  })
}

export const useCreateSeasonMutation = () => {
  return useMutation<CreateResponse[], Error, CreateSeason>(async (formData) => (await functionAxios.post(`/seasons`, formData)).data)
}

export const useUpdateSeasonMutation = (seasonId: number) => {
  return useMutation<CreateResponse[], Error, CreateSeason>(
    async (formData) => (await functionAxios.put(`/seasons/${seasonId}`, formData)).data
  )
}

export const useDeleteSeasonMutation = (seasonId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/seasons/${seasonId}`)).data)
}

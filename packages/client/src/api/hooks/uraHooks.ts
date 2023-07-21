import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { functionAxios } from '../../util/initAxios'
import { PontozoError } from '../model/error'
import { CreateResponse, CreateURA, UpdateURA, UserRoleAssignment } from '@pontozo/types'

export const useFetchUras = () => {
  return useQuery<UserRoleAssignment[]>(['fetchUras'], async () => (await functionAxios.get(`/uras`)).data, { retry: false })
}

export const useFetchUra = (uraId: number) => {
  return useQuery<UserRoleAssignment>(['fetchUra', uraId], async () => (await functionAxios.get(`/uras/${uraId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: uraId > 0,
  })
}

export const useCreateUraMutation = () => {
  return useMutation<CreateResponse[], AxiosError<PontozoError[]>, CreateURA>(
    async (formData) => (await functionAxios.post(`/uras`, formData)).data
  )
}

export const useUpdateUraMutation = (uraId: number) => {
  return useMutation<CreateResponse[], AxiosError<PontozoError[]>, UpdateURA>(
    async (formData) => (await functionAxios.put(`/uras/${uraId}`, formData)).data
  )
}

export const useDeleteUraMutation = (uraId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/uras/${uraId}`)).data)
}

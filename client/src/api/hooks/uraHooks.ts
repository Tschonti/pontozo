import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { functionAxios } from '../../util/initAxios'
import { PontozoError } from '../model/error'
import { CreateUra, UpdateUra, UserRoleAssignment } from '../model/user'
import { CreateResponse } from './categoryHooks'

export const useFetchUras = () => {
  return useQuery<UserRoleAssignment[]>(['fetchUras'], async () => (await functionAxios.get(`/uras`)).data, { retry: false })
}

export const useFetchUra = (uraId: number) => {
  return useQuery<UserRoleAssignment>(['fetchUra', uraId], async () => (await functionAxios.get(`/uras/${uraId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: uraId > 0
  })
}

export const useCreateUraMutation = () => {
  return useMutation<CreateResponse[], AxiosError<PontozoError[]>, CreateUra>(
    async (formData) => (await functionAxios.post(`/uras`, formData)).data
  )
}

export const useUpdateUraMutation = (uraId: number) => {
  return useMutation<CreateResponse[], AxiosError<PontozoError[]>, UpdateUra>(
    async (formData) => (await functionAxios.put(`/uras/${uraId}`, formData)).data
  )
}

export const useDeleteUraMutation = (uraId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/uras/${uraId}`)).data)
}

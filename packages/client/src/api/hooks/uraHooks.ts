import { CreateResponse, CreateURA, PontozoError, UpdateURA, UserRoleAssignment } from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/axiosConfig'

export const useFetchUras = () => {
  return useQuery<UserRoleAssignment[], PontozoError>(['fetchUras'], async () => (await functionAxios.get(`/uras`)).data, { retry: false })
}

export const useFetchUra = (uraId: number) => {
  return useQuery<UserRoleAssignment, PontozoError>(['fetchUra', uraId], async () => (await functionAxios.get(`/uras/${uraId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: uraId > 0,
  })
}

export const useCreateUraMutation = () => {
  return useMutation<CreateResponse[], PontozoError, CreateURA>(async (formData) => (await functionAxios.post(`/uras`, formData)).data)
}

export const useUpdateUraMutation = (uraId: number) => {
  return useMutation<CreateResponse[], PontozoError, UpdateURA>(
    async (formData) => (await functionAxios.put(`/uras/${uraId}`, formData)).data
  )
}

export const useDeleteUraMutation = (uraId: number) => {
  return useMutation<unknown, PontozoError>(async () => (await functionAxios.delete(`/uras/${uraId}`)).data)
}

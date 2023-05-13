import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/initAxios'
import { Criterion } from '../model/criterion'
import { CreateUra, UpdateUra, UserRoleAssignment } from '../model/user'
import { CreateResponse } from './categoryHooks'

export const useFetchUras = () => {
  return useQuery<UserRoleAssignment[]>(['fetchUras'], async () => (await functionAxios.get(`/uras`)).data, { retry: false })
}

export const useFetchUra = (uraId: number) => {
  return useQuery<Criterion>(['fetchUra', uraId], async () => (await functionAxios.get(`/uras/${uraId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: uraId > 0
  })
}

export const useCreateCriterionMutation = () => {
  return useMutation<CreateResponse[], Error, CreateUra>(async (formData) => (await functionAxios.post(`/uras`, formData)).data)
}

export const useUpdateCriterionMutation = (uraId: number) => {
  return useMutation<CreateResponse[], Error, UpdateUra>(async (formData) => (await functionAxios.put(`/uras/${uraId}`, formData)).data)
}

export const useDeleteCriterionMutation = (uraId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/uras/${uraId}`)).data)
}

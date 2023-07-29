import { Category, CategoryWithCriteria, CreateCategory, CreateResponse, EntityWithEditableIndicator } from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/axiosConfig'

export const useFetchCategories = () => {
  return useQuery<Category[]>(['fetchCategories'], async () => (await functionAxios.get(`/categories`)).data, { retry: false })
}

export const useFetchCategory = (categoryId: number) => {
  return useQuery<EntityWithEditableIndicator<CategoryWithCriteria>>(
    ['fetchCategory', categoryId],
    async () => (await functionAxios.get(`/categories/${categoryId}`)).data,
    {
      retry: false,
      refetchInterval: false,
      enabled: categoryId > 0,
    }
  )
}

export const useCreateCategoryMutation = () => {
  return useMutation<CreateResponse[], Error, CreateCategory>(async (formData) => (await functionAxios.post(`/categories`, formData)).data)
}

export const useUpdateCategoryMutation = (categoryId: number) => {
  return useMutation<CreateResponse[], Error, CreateCategory>(
    async (formData) => (await functionAxios.put(`/categories/${categoryId}`, formData)).data
  )
}

export const useDeleteCategoryMutation = (categoryId: number) => {
  return useMutation<CreateResponse[], Error>(async () => (await functionAxios.delete(`/categories/${categoryId}`)).data)
}

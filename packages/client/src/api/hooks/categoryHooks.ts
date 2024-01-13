import {
  Category,
  CategoryWithCriteria,
  CategoryWithSeasons,
  CreateCategory,
  CreateResponse,
  EntityWithEditableIndicator,
  PontozoError,
} from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/axiosConfig'

export const useFetchCategories = () => {
  return useQuery<CategoryWithSeasons[], PontozoError>(['fetchCategories'], async () => (await functionAxios.get(`/categories`)).data, {
    retry: false,
  })
}

export const useFetchCategory = (categoryId: number) => {
  return useQuery<EntityWithEditableIndicator<CategoryWithCriteria>, PontozoError>(
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
  return useMutation<CreateResponse[], PontozoError, CreateCategory>(
    async (formData) => (await functionAxios.post(`/categories`, formData)).data
  )
}

export const useUpdateCategoryMutation = (categoryId: number) => {
  return useMutation<CreateResponse[], PontozoError, CreateCategory>(
    async (formData) => (await functionAxios.put(`/categories/${categoryId}`, formData)).data
  )
}

export const useDeleteCategoryMutation = (categoryId: number) => {
  return useMutation<CreateResponse[], PontozoError>(async () => (await functionAxios.delete(`/categories/${categoryId}`)).data)
}

export const useDuplicateCategoryMutation = (categoryId: number) => {
  return useMutation<Category, Error>(async () => (await functionAxios.post(`/categories/${categoryId}/duplicate`)).data)
}

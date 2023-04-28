import { useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/initAxios'
import { Criterion } from '../model/criterion'

export const useFetchCriteria = () => {
  return useQuery<Criterion[]>(['fetchCriteria'], async () => (await functionAxios.get(`/criteria`)).data, { retry: false })
}

export const useFetchCriterion = (criterionId: number, onSuccess: (data: Criterion) => void) => {
  return useQuery<Criterion>(['fetchCriterion', criterionId], async () => (await functionAxios.get(`/criteria/${criterionId}`)).data, {
    retry: false,
    refetchInterval: false,
    enabled: criterionId > 0,
    onSuccess
  })
}

import { useQuery } from '@tanstack/react-query'
import { FUNC_HOST } from '../../util/environment'
import { functionAxios } from '../../util/initAxios'
import { Criterion } from '../model/criterion'

export const useFetchCriteria = () => {
  return useQuery<Criterion[]>(['fetchCriteria'], async () => (await functionAxios.get(`${FUNC_HOST}/criteria`)).data, { retry: false })
}

// export const useFetchCriterion = (criterionId: number, onSuccess: (data: CriterionDetails) => void) => {
//   return useQuery<CriterionDetails>(
//     ['fetchCriterion', criterionId],
//     async () => (await axios.get(`${API_HOST}/criteria/${criterionId}`)).data,
//     { retry: false, onSuccess }
//   )
// }

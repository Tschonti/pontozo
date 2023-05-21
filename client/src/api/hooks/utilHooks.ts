import { useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/initAxios'

export const usePing = () => {
  return useQuery(['ping'], async () => await functionAxios.get('/ping'), { retry: false, refetchInterval: false })
}

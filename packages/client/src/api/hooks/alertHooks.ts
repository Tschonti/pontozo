import { Alert, PontozoError } from '@pontozo/common'
import { useQuery } from '@tanstack/react-query'
import { functionAxios } from 'src/util/axiosConfig'

export const useFetchAlerts = () => {
  return useQuery<Alert[], PontozoError>(['fetchAlerts'], async () => (await functionAxios.get(`/alerts`)).data, {
    retry: false,
  })
}

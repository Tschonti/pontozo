import { AuthToken, DbUser, PontozoError } from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from 'src/util/axiosConfig'

export const useUserDataQuery = (enabled: boolean) =>
  useQuery(['currentUser'], async () => (await functionAxios.get<DbUser>('/auth/user')).data, {
    enabled,
    retry: false,
  })

export const useValidateUserRolesMutation = () =>
  useMutation<AuthToken, PontozoError>(async () => (await functionAxios.get<AuthToken>('auth/verify')).data)

export const usePurgeUserMutation = () => useMutation<unknown, PontozoError>(async () => (await functionAxios.delete('users')).data)

import { useMutation } from '@tanstack/react-query'
import { UserSelectorForm } from '../../pages/uras/types/UserSelectorForm'
import { APIM_HOST } from '../../util/environment'
import { apimAxios } from '../../util/initAxios'
import { User } from '../model/user'

type MtfszResponse = {
  result: User[]
  page_size: number
}

export const useFetchUsersMutation = () => {
  return useMutation<User[], Error, UserSelectorForm>(async (data: UserSelectorForm) => {
    if (data.userId) {
      try {
        const res = await apimAxios.get(`/szemelyek/${data.userId}`)
        return [res.data]
      } catch {
        return []
      }
    }
    const url = new URL('/szemelyek', APIM_HOST)
    if (data.firstName) {
      url.searchParams.append('keresztnev', data.firstName)
    }
    if (data.lastName) {
      url.searchParams.append('vezeteknev', data.lastName)
    }
    if (data.yob) {
      url.searchParams.append('szul_ev', data.yob.toString())
    }
    return (await apimAxios.get<MtfszResponse>(url.toString())).data.result
  })
}

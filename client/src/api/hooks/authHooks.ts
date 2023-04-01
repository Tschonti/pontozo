import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Cookies from 'js-cookie'
import { CookieKeys } from '../../util/CookieKeys'
import { CLIENT_ID, CLIENT_SECRET, MTFSZ_TOKEN } from '../../util/environment'
import { AccessTokenRes } from '../model/auth'

export const useGetAccessToken = () => {
  const formData = new FormData()
  formData.append('grantType', 'client_credentials')

  return useQuery<AccessTokenRes>(
    ['getAccessToken'],
    async () => (await axios.post(MTFSZ_TOKEN, formData, { auth: { username: CLIENT_ID, password: CLIENT_SECRET } })).data,
    {
      onError: (e) => console.error(e),
      onSuccess: (res) => {
        Cookies.set(CookieKeys.ACCESS_TOKEN, res.access_token)
      },
      refetchInterval: 60 * 60 * 1000,
      retry: false
    }
  )
}

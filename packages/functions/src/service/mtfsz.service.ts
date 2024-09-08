import { MtfszToken, MtfszUser, PontozoException, RawMtfszUser } from '@pontozo/common'
import axios, { AxiosResponse } from 'axios'
import { APIM_HOST, APIM_KEY, CLIENT_ID, CLIENT_SECRET, FUNCTION_HOST, MTFSZ_API_HOST } from '../util/env'

export const userProjection = ({ szemely_szervezetek, versenyengedelyek, ...restOfUser }: RawMtfszUser) => ({ ...restOfUser })

const mtfszApiMgmtAxios = axios.create({
  baseURL: APIM_HOST,
  headers: {
    'Ocp-Apim-Subscription-Key': APIM_KEY,
  },
})

export const getToken = async (authCode: string): Promise<MtfszToken> => {
  const fd = new FormData()
  fd.append('grant_type', 'authorization_code')
  fd.append('code', authCode)
  fd.append('redirect_uri', `${FUNCTION_HOST}/auth/callback`)
  fd.append('client_id', CLIENT_ID)
  fd.append('client_secret', CLIENT_SECRET)
  const response = await axios.post<unknown, AxiosResponse<MtfszToken>>(`${MTFSZ_API_HOST}/oauth/v2/token`, fd)
  return response.data
}

export const getUser = async (accessToken: string): Promise<MtfszUser> => {
  return (
    await axios.get<MtfszUser>(`${MTFSZ_API_HOST}/api/v1_0/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).data
}

export const getUserById = async (userId: number): Promise<RawMtfszUser> => {
  try {
    const res = await mtfszApiMgmtAxios.get<RawMtfszUser>(`/szemelyek/${userId}`)
    return res.data
  } catch {
    throw new PontozoException('A felhasználó nem található!', 404)
  }
}

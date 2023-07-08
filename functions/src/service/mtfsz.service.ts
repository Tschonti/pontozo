import axios, { AxiosResponse } from 'axios'
import { MtfszUser } from '../functions/auth/types/MtfszUser'
import { Token } from '../functions/auth/types/Token'
import { APIM_HOST, APIM_KEY, CLIENT_ID, CLIENT_SECRET, FUNCTION_HOST } from '../util/env'
import { Event, EventSection, EventSectionPreview, MtfszResponse, ServiceResponse, User } from './types'

const acceptedRanks = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']
const higherRanks = ['ORSZAGOS', 'KIEMELT']

const eventFilter = (e: Event) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedRanks.includes(p.futam.rangsorolo))

const isHigherRank = (e: Event) =>
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && higherRanks.includes(p.futam.rangsorolo))

export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedRanks.includes(s.futam.rangsorolo)

export const stageProjection: (e: EventSection) => EventSectionPreview = ({ fajlok, hivatkozasok, helyszinek, ...restOfData }) => ({
  ...restOfData
})

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const userProjection = ({ szemely_szervezetek, versenyengedelyek, ...restOfUser }: User) => ({ ...restOfUser })

const mtfszAxios = axios.create({
  baseURL: APIM_HOST,
  headers: {
    'Ocp-Apim-Subscription-Key': APIM_KEY
  }
})

export const getOneEvent = async (eventId: number): Promise<ServiceResponse<Event>> => {
  const res = await mtfszAxios.get<MtfszResponse>(`/esemenyek?esemeny_id=${eventId}`)
  if (res.data.result.length === 0 || !eventFilter(res.data.result[0])) {
    return {
      isError: true,
      status: 404,
      message: 'Event not found or invalid'
    }
  }
  return {
    isError: false,
    data: {
      ...res.data.result[0],
      pontozoOrszagos: isHigherRank(res.data.result[0])
    }
  }
}

export const getRateableEvents = async (): Promise<Event[]> => {
  const url = new URL('esemenyek', APIM_HOST)
  const today = new Date()
  const twoWeeksAgo = new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000) // TODO finalize no of days
  url.searchParams.append('datum_tol', formatDate(twoWeeksAgo))
  url.searchParams.append('datum_ig', formatDate(today))
  url.searchParams.append('exclude_deleted', 'true')
  const res = await mtfszAxios.get<MtfszResponse>(url.toString())

  return res.data.result.filter(eventFilter)
}

export const getToken = async (authCode: string): Promise<Token> => {
  const fd = new FormData()
  fd.append('grant_type', 'authorization_code')
  fd.append('code', authCode)
  fd.append('redirect_uri', `${FUNCTION_HOST}/auth/callback`)
  fd.append('client_id', CLIENT_ID)
  fd.append('client_secret', CLIENT_SECRET)
  const response = await axios.post<unknown, AxiosResponse<Token>>('https://api.mtfsz.hu/oauth/v2/token', fd)
  return response.data
}

export const getUser = async (accessToken: string): Promise<MtfszUser> => {
  return (
    await axios.get<MtfszUser>('https://api.mtfsz.hu/api/v1_0/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  ).data
}

export const getUserById = async (userId: number): Promise<ServiceResponse<User>> => {
  try {
    const res = await mtfszAxios.get<User>(`/szemelyek/${userId}`)
    return {
      isError: false,
      data: res.data
    }
  } catch {
    return {
      isError: true,
      status: 404,
      message: 'User not found'
    }
  }
}

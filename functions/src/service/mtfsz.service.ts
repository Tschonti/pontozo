import axios, { AxiosResponse } from 'axios'
import { MtfszUser } from '../functions/auth/types/MtfszUser'
import { Token } from '../functions/auth/types/Token'
import { APIM_HOST, APIM_KEY, CLIENT_ID, CLIENT_SECRET, FUNCTION_HOST } from '../util/env'
import { Event, EventSection, EventSectionPreview, MtfszResponse, ServiceResponse } from './types'

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

export const getOneEvent = async (eventId: number): Promise<ServiceResponse<Event>> => {
  const url = new URL('esemenyek', APIM_HOST)
  url.searchParams.append('esemeny_id', eventId.toString())

  const res = await axios.get<MtfszResponse>(url.toString(), { headers: { 'Ocp-Apim-Subscription-Key': APIM_KEY } })
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

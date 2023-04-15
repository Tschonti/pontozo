import axios from 'axios'
import { APIM_HOST, APIM_KEY } from '../util/env'
import { MtfszResponse } from './types'

export const getOneEvent = async (eventId: number) => {
  const url = new URL('esemenyek', APIM_HOST)
  url.searchParams.append('esemeny_id', eventId.toString())

  const res = await axios.get<MtfszResponse>(url.toString(), { headers: { 'Ocp-Apim-Subscription-Key': APIM_KEY } })
  if (res.data.result.length === 0) {
    return null
  }
  return res.data.result[0]
}

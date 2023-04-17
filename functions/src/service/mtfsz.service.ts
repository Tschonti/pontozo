import axios from 'axios'
import { APIM_HOST, APIM_KEY } from '../util/env'
import { Event, EventSection, MtfszResponse } from './types'

const acceptedRanks = ['REGIONALIS', 'ORSZAGOS', 'KIEMELT']
const higherRanks = ['ORSZAGOS', 'KIEMELT']

const eventFilter = (e: Event) =>
  e.tipus === 'VERSENY' &&
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && acceptedRanks.includes(p.futam.rangsorolo))

export const stageFilter = (s: EventSection) => s.tipus === 'FUTAM' && acceptedRanks.includes(s.futam.rangsorolo)

const isHigherRank = (e: Event) =>
  e.programok.some((p) => p.tipus === 'FUTAM' && p.futam.szakag === 'TAJFUTAS' && higherRanks.includes(p.futam.rangsorolo))

export const getOneEvent = async (eventId: number): Promise<Event> => {
  const url = new URL('esemenyek', APIM_HOST)
  url.searchParams.append('esemeny_id', eventId.toString())

  const res = await axios.get<MtfszResponse>(url.toString(), { headers: { 'Ocp-Apim-Subscription-Key': APIM_KEY } })
  if (res.data.result.length === 0 || !eventFilter(res.data.result[0])) {
    return null
  }
  return {
    ...res.data.result[0],
    pontozoOrszagos: isHigherRank(res.data.result[0])
  }
}

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { APIM_HOST, APIM_KEY } from '../../util/environment'
import { eventFilter } from '../../util/eventFilter'
import { Event, FetchEventsResult } from '../model/event'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const useFetchEventsLastMonth = () => {
  return useQuery<Event[]>(
    ['fetchEvents'],
    async () => {
      const url = new URL('esemenyek', APIM_HOST)
      const today = new Date()
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      url.searchParams.append('datum_tol', formatDate(oneMonthAgo))
      url.searchParams.append('datum_ig', formatDate(today))
      url.searchParams.append('exclude_deleted', 'true')
      const res = await axios.get<FetchEventsResult>(url.toString(), {
        headers: {
          'Ocp-Apim-Subscription-Key': APIM_KEY
        }
      })
      return res.data.result.filter(eventFilter)
    },
    { retry: false }
  )
}

export const useFetchEvent = (eventId: number) => {
  return useQuery<FetchEventsResult>(
    ['fetchEvent', eventId],
    async () => {
      const url = new URL('esemenyek', APIM_HOST)
      url.searchParams.append('esemeny_id', eventId.toString())
      const res = await axios.get(url.toString(), {
        headers: {
          'Ocp-Apim-Subscription-Key': APIM_KEY
        }
      })
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

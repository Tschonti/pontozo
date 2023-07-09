import { useQuery } from '@tanstack/react-query'
import { APIM_HOST, APIM_KEY } from '../../util/environment'
import { eventFilter } from '../../util/eventFilter'
import { apimAxios, functionAxios } from '../../util/initAxios'
import { transformEvent } from '../../util/mtfszEventToDbEvent'
import { DbEvent } from '../model/dbEvent'
import { FetchEventsResult } from '../model/mtfszEvent'
import { EventRating } from '../model/rating'

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

export const useFetchEventsLastMonth = () => {
  return useQuery<DbEvent[]>(
    ['fetchEvents'],
    async () => {
      const url = new URL('esemenyek', APIM_HOST)
      const today = new Date()
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      url.searchParams.append('datum_tol', formatDate(oneMonthAgo))
      url.searchParams.append('datum_ig', formatDate(today))
      url.searchParams.append('exclude_deleted', 'true')
      const res = await apimAxios.get<FetchEventsResult>(url.toString(), {
        headers: {
          'Ocp-Apim-Subscription-Key': APIM_KEY
        }
      })
      return res.data.result.filter(eventFilter).map(transformEvent)
    },
    { retry: false }
  )
}

export const useFetchEvent = (eventId: number) => {
  return useQuery<DbEvent>(
    ['fetchEvent', eventId],
    async () => {
      const res = await functionAxios.get(`events/${eventId}`)
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

export const useFecthUserRatedEvents = () => {
  return useQuery<EventRating[]>(['fetchUserRatedEvents'], async () => (await functionAxios.get('events/ratedByUser')).data, {
    retry: false
  })
}

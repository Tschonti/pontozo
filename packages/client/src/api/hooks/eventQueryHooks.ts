import { useQuery } from '@tanstack/react-query'
import { APIM_HOST, APIM_KEY } from '../../util/environment'
import { functionAxios } from '../../util/axiosConfig'
import { DbEvent, EventRatingWithEvent, EventWithRating, getRateableEvents } from '@pontozo/common'
import { transformEvent } from 'src/util/typeTransforms'

export const useFetchEventsLastMonthFromMtfsz = () => {
  return useQuery<DbEvent[]>(
    ['fetchEventsMtfsz'],
    async () => {
      const events = await getRateableEvents(APIM_KEY, APIM_HOST)
      return events.map(transformEvent).sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
    },
    { retry: false }
  )
}

export const useFetchEventsLastMonthFromDb = () => {
  return useQuery<DbEvent[]>(
    ['fetchEventsDb'],
    async () => {
      const res = await functionAxios.get<DbEvent[]>('events/rateable')
      return res.data.sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
    },
    { retry: false }
  )
}

export const useFetchEvent = (eventId: number) => {
  return useQuery<EventWithRating>(
    ['fetchEvent', eventId],
    async () => {
      const res = await functionAxios.get(`events/getOne/${eventId}`)
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

export const useFecthUserRatedEvents = () => {
  return useQuery<EventRatingWithEvent[]>(['fetchUserRatedEvents'], async () => (await functionAxios.get('events/ratedByUser')).data, {
    retry: false,
  })
}

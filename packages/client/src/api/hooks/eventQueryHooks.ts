import { DbEvent, EventRatingWithEvent, EventWithRating, getRateableEvents, PontozoError } from '@pontozo/common'
import { useQuery } from '@tanstack/react-query'
import { transformEvent } from 'src/util/typeTransforms'
import { functionAxios } from '../../util/axiosConfig'
import { APIM_HOST, APIM_KEY } from '../../util/environment'

export const useFetchRateableEventsFromMtfsz = () => {
  return useQuery<DbEvent[]>(
    ['fetchEventsMtfsz'],
    async () => {
      const events = await getRateableEvents(APIM_KEY, APIM_HOST)
      return events.map(transformEvent).sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
    },
    { retry: false }
  )
}

export const useFetchRateableEventsFromDb = () => {
  return useQuery<DbEvent[], PontozoError>(
    ['fetchEventsDb'],
    async () => {
      const res = await functionAxios.get<DbEvent[]>('events/rateable')
      return res.data.sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
    },
    { retry: false }
  )
}

export const useFetchEvent = (eventId: number) => {
  return useQuery<EventWithRating, PontozoError>(
    ['fetchEvent', eventId],
    async () => {
      const res = await functionAxios.get(`events/getOne/${eventId}`)
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

export const useFecthUserRatedEvents = () => {
  return useQuery<EventRatingWithEvent[], PontozoError>(
    ['fetchUserRatedEvents'],
    async () => (await functionAxios.get('events/ratedByUser')).data,
    {
      retry: false,
    }
  )
}

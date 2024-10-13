import { AllSeasonsAndOne, EventMessages, EventResultList, EventWithResults, PontozoError } from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { EventFilter } from 'src/pages/results/types/EventFilter'
import { functionAxios } from 'src/util/axiosConfig'
import { FUNC_HOST } from 'src/util/environment'

export const useFetchEventResultsMutation = () => {
  return useMutation<EventResultList, PontozoError, EventFilter>(async (data: EventFilter) => {
    const url = new URL('/results', FUNC_HOST)
    if (data.seasonId) {
      url.searchParams.append('seasonId', data.seasonId.toString())
    }
    if (data.categoryIds.length > 0) {
      url.searchParams.append('categoryIds', data.categoryIds.join(','))
    }
    if (data.criterionIds.length > 0) {
      url.searchParams.append('criterionIds', data.criterionIds.join(','))
    }
    url.searchParams.append('nationalOnly', data.nationalOnly.toString())
    url.searchParams.append('includeTotal', data.includeTotal.toString())
    return (await functionAxios.get<EventResultList>(url.toString())).data
  })
}

export const useFetchSeasonsMutation = () => {
  return useMutation<AllSeasonsAndOne, PontozoError, number | undefined>(async (seasonId?: number) => {
    const url = new URL('/seasons/getAll', FUNC_HOST)
    if (seasonId) {
      url.searchParams.append('seasonId', seasonId.toString())
    }
    return (await functionAxios.get<AllSeasonsAndOne>(url.toString())).data
  })
}

export const useFetchEventResults = (eventId: number) => {
  return useQuery<EventWithResults, PontozoError>(
    ['fetchEventResults', eventId],
    async () => {
      const res = await functionAxios.get(`results/${eventId}`)
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

export const useFetchEventMessages = (eventId: number) => {
  return useQuery<EventMessages, PontozoError>(
    ['fetchEventMessages', eventId],
    async () => {
      const res = await functionAxios.get(`results/${eventId}/messages`)
      return res.data
    },
    { retry: false, enabled: !isNaN(eventId) && eventId > 0 }
  )
}

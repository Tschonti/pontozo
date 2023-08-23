import {
  CreateEventRating,
  CriterionRating,
  EventRatingInfo,
  GetCriterionRatings,
  GetEventRating,
  PageTurn,
  PontozoError,
  RatingStartedResponse,
} from '@pontozo/common'
import { useMutation, useQuery } from '@tanstack/react-query'
import { functionAxios } from '../../util/axiosConfig'
import { FUNC_HOST } from '../../util/environment'

export const useStartRatingMutation = () => {
  return useMutation<RatingStartedResponse[], PontozoError, CreateEventRating>(
    async (data) => (await functionAxios.post(`${FUNC_HOST}/ratings`, data)).data
  )
}

export const useSubmitRatingMutation = () => {
  return useMutation<unknown, PontozoError, number>(
    async (ratingId: number) => (await functionAxios.post(`${FUNC_HOST}/ratings/${ratingId}/submit`)).data
  )
}

export const useTurnPageMutation = () => {
  return useMutation<unknown, PontozoError, PageTurn & { ratingId: number }>(
    async ({ ratingId, ...data }) => (await functionAxios.post(`${FUNC_HOST}/ratings/${ratingId}/turn`, data)).data
  )
}

export const useFetchRatingsMutation = (ratingId: number) => {
  return useMutation<CriterionRating[], PontozoError, GetCriterionRatings>(
    async (data) => (await functionAxios.post(`/ratings/${ratingId}/criteria`, data)).data
  )
}

export const useFetchEventInfoMutation = () => {
  return useMutation<EventRatingInfo, PontozoError, number>(
    async (ratingId: number) => (await functionAxios.get(`/ratings/${ratingId}/info`)).data
  )
}

export const useFetchEventRatingQuery = (eventId: number) => {
  return useQuery<GetEventRating, PontozoError>(
    ['fetchEventRating', eventId],
    async () => (await functionAxios.get(`ratings/event/${eventId}`)).data
  )
}

export const useFetchRatingInfo = (onSuccess: (data: EventRatingInfo) => void, ratingId: number) => {
  return useQuery(['ratingInfo', ratingId], async () => (await functionAxios.get<EventRatingInfo>(`/ratings/${ratingId}/info`)).data, {
    enabled: ratingId > 0,
    retry: false,
    onSuccess,
  })
}

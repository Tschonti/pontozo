import {
  CreateEventRating,
  CriterionRating,
  EventRatingInfo,
  GetCriterionRatings,
  GetEventRating,
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

import { useMutation, useQuery } from '@tanstack/react-query'
import { FUNC_HOST } from '../../util/environment'
import { functionAxios } from '../../util/axiosConfig'
import { CriterionRating, EventRatingInfo, GetCriterionRatings, GetEventRating, CreateEventRating } from '@pontozo/common'

export const useStartRatingMutation = () => {
  return useMutation<RatingStartedResponse[], Error, CreateEventRating>(
    async (data) => (await functionAxios.post(`${FUNC_HOST}/ratings`, data)).data
  )
}

export const useSubmitRatingMutation = () => {
  return useMutation<unknown, Error, number>(
    async (ratingId: number) => (await functionAxios.post(`${FUNC_HOST}/ratings/${ratingId}/submit`)).data
  )
}

export const useFetchRatingsMutation = (ratingId: number) => {
  return useMutation<CriterionRating[], Error, GetCriterionRatings>(
    async (data) => (await functionAxios.post(`/ratings/${ratingId}/criteria`, data)).data
  )
}

export const useFetchEventInfoMutation = () => {
  return useMutation<EventRatingInfo, Error, number>(
    async (ratingId: number) => (await functionAxios.get(`/ratings/${ratingId}/info`)).data
  )
}

export const useFetchEventRatingQuery = (eventId: number) => {
  return useQuery<GetEventRating>(['fetchEventRating', eventId], async () => (await functionAxios.get(`ratings/event/${eventId}`)).data)
}

export type RatingStartedResponse = {
  id: number
  status: string
}

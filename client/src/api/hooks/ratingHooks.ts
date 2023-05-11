import { useMutation, useQuery } from '@tanstack/react-query'
import { FUNC_HOST } from '../../util/environment'
import { functionAxios } from '../../util/initAxios'
import { CategoryWithCriteria } from '../model/category'
import { CriterionRating, EventRatingInfo, EventToRate, GetCriterionRatings, StageToRate, StartRatingDto } from '../model/rating'

export const useStartRatingMutation = () => {
  return useMutation<RatingStartedResponse[], Error, StartRatingDto>(
    async (data) => (await functionAxios.post(`${FUNC_HOST}/ratings`, data)).data
  )
}

export const useSubmitRatingMutation = (ratingId: number) => {
  return useMutation<unknown, Error>(async () => (await functionAxios.post(`${FUNC_HOST}/ratings/${ratingId}/submit`)).data)
}

export const useFetchRatingQuery = (ratingId: number, categoryIdx: number, stageId: number) => {
  return useQuery<CategoryWithCriteria>(
    ['fetchRating', ratingId, categoryIdx, stageId],
    async () => {
      const url = new URL(`/ratings/${ratingId}`, FUNC_HOST)
      url.searchParams.append('categoryIdx', categoryIdx.toString())
      if (stageId > 0) {
        url.searchParams.append('stageId', stageId.toString())
      }
      const res = await functionAxios.get(url.toString())
      return res.data
    },
    {
      retry: false,
      enabled: !isNaN(ratingId) && ratingId > 0 && !isNaN(categoryIdx) && categoryIdx >= 0
    }
  )
}

export const useFetchRatingsMutation = (ratingId: number) => {
  return useMutation<CriterionRating[], Error, GetCriterionRatings>(
    async (data) => (await functionAxios.post(`/ratings/${ratingId}/criteria`, data)).data
  )
}

export const useFetchEventRatingQuery = (ratingId: number) => {
  return useQuery<EventToRate>(['fetchRating', ratingId], async () => (await functionAxios.get(`${FUNC_HOST}/ratings/${ratingId}`)).data, {
    retry: false,
    enabled: !isNaN(ratingId) && ratingId > 0
  })
}

export const useFetchStageRatingQuery = (ratingId: number, stageId: number) => {
  return useQuery<StageToRate>(
    ['fetchStageRating', ratingId, stageId],
    async () => (await functionAxios.get(`${FUNC_HOST}/ratings/${ratingId}/stage/${stageId}`)).data,
    {
      retry: false,
      enabled: !isNaN(ratingId) && ratingId > 0 && !isNaN(stageId) && stageId > 0
    }
  )
}

export const useFetchEventInfoMutation = () => {
  return useMutation<EventRatingInfo, Error, number>(
    async (ratingId: number) => (await functionAxios.get(`/ratings/${ratingId}/info`)).data
  )
}

export type RatingStartedResponse = {
  id: number
  status: string
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { FUNC_HOST } from '../../util/environment'
import { functionAxios } from '../../util/initAxios'
import { EventToRate, StageToRate, StartRatingDto } from '../model/rating'

export const useStartRatingMutation = () => {
  return useMutation<RatingStartedResponse[], Error, StartRatingDto>(
    async (data) => (await functionAxios.post(`${FUNC_HOST}/ratings`, data)).data
  )
}

export const useSubmitRatingMutation = (ratingId: number) => {
  return useMutation<unknown, Error>(async () => (await functionAxios.post(`${FUNC_HOST}/ratings/${ratingId}/submit`)).data)
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

export type RatingStartedResponse = {
  id: number
  status: string
}

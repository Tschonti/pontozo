import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FUNC_HOST } from '../../util/environment'
import { RatingWithCriterionDto, StartRatingDto } from '../model/rating'

export const useStartRatingMutation = () => {
  return useMutation<RatingStartedResponse[], Error, StartRatingDto>(async (data) => (await axios.post(`${FUNC_HOST}/ratings`, data)).data)
}

export const useFetchRatingQuery = (ratingId: number) => {
  return useQuery<RatingWithCriterionDto>(
    ['fetchRating', ratingId],
    async () => (await axios.get(`${FUNC_HOST}/ratings/${ratingId}`)).data,
    {
      retry: false,
      enabled: !isNaN(ratingId) && ratingId > 0
    }
  )
}

export type RatingStartedResponse = {
  id: number
  status: string
}

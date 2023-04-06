import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { API_HOST } from '../../util/environment'
import { StartRatingDto } from '../model/rating'

export const useStartRatingMutation = () => {
  return useMutation<unknown, Error, StartRatingDto>(async (data) => (await axios.post(`${API_HOST}/ratings`, data)).data, {
    onSuccess: (r) => console.log(r)
  })
}

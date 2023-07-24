import { useContext } from 'react'
import { RatingContext, RatingContextType } from './RatingContext'

export const useRatingContext = () => {
  return useContext<RatingContextType>(RatingContext)
}

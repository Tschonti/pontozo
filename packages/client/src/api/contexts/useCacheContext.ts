import { useContext } from 'react'
import { CacheContext, CacheContextType } from './CacheContext'

export const useCacheContext = () => {
  return useContext<CacheContextType>(CacheContext)
}

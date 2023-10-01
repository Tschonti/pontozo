import { DbEvent, PontozoError } from '@pontozo/common'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useFetchRateableEventsFromCache, useFetchRateableEventsFromDb } from '../hooks/eventQueryHooks'

export type CacheContextType = {
  dbQueryLoading: boolean
  eventData?: DbEvent[]
  eventDataLoading: boolean
  eventDataError?: PontozoError
  refetchEventData: () => void
}

export const CacheContext = createContext<CacheContextType>({
  dbQueryLoading: true,
  eventDataLoading: true,
  refetchEventData: () => {},
  eventData: undefined,
  eventDataError: undefined,
})

export const CacheProvider = ({ children }: PropsWithChildren) => {
  const [dbDataInitialLoad, setDbDataInitialLoad] = useState(true)
  const { data: dbData, isLoading: dbDataLoading, error: dbDataError, refetch } = useFetchRateableEventsFromDb()
  const { data: cachedData, isLoading: cachedDataLoading, error: cachedDataError } = useFetchRateableEventsFromCache()

  useEffect(() => {
    if (dbDataInitialLoad && !dbDataLoading) {
      setDbDataInitialLoad(false)
    }
  }, [dbDataLoading, dbDataInitialLoad])
  return (
    <CacheContext.Provider
      value={{
        dbQueryLoading: dbDataInitialLoad,
        eventDataLoading: dbDataLoading && cachedDataLoading,
        refetchEventData: refetch,
        eventData: dbData || cachedData,
        eventDataError: dbDataError && cachedDataError ? dbDataError : undefined,
      }}
    >
      {children}
    </CacheContext.Provider>
  )
}

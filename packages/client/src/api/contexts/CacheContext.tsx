import { Box, Heading, Spinner, Text, ToastId, useToast, VStack } from '@chakra-ui/react'
import { DbEvent, PontozoError } from '@pontozo/common'
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useFetchRateableEventsFromCache, useFetchRateableEventsFromDb } from '../hooks/eventQueryHooks'

// NOT USED ANYMORE

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
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout>()
  const toastRef = useRef<ToastId>()
  const {
    data: dbData,
    isLoading: dbDataLoading,
    error: dbDataError,
    refetch,
    isFetchedAfterMount: dbIsFetchedAfterMount,
  } = useFetchRateableEventsFromDb()
  const {
    data: cachedData,
    isLoading: cachedDataLoading,
    error: cachedDataError,
    isFetchedAfterMount: cacheIsFetchedAfterMount,
  } = useFetchRateableEventsFromCache()
  const toast = useToast()

  useEffect(() => {
    if (dbDataInitialLoad && !dbDataLoading) {
      setDbDataInitialLoad(false)
      clearTimeout(toastTimeout)
      if (toastRef.current) {
        toast.close(toastRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbDataLoading, dbDataInitialLoad])

  useEffect(() => {
    if (cacheIsFetchedAfterMount && !dbIsFetchedAfterMount) {
      const timeout = setTimeout(() => {
        toastRef.current = toast({
          duration: null,
          position: 'top-right',
          render: () => (
            <Box bgColor="brand.500" color="white" display="flex" padding="12px 32px 12px 16px" borderRadius="0.375rem" alignItems="center">
              <Spinner mr="12px" size="sm" thickness="3px" color="white" />
              <VStack alignItems="flex-start" spacing={0}>
                <Heading size="sm">Betöltés...</Heading>
                <Text>Betöltés folyamatban, addig nem tudsz minden funkciót használni!</Text>
              </VStack>
            </Box>
          ),
        })
      }, 1000)
      setToastTimeout(timeout)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [toast, cacheIsFetchedAfterMount, dbIsFetchedAfterMount])

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

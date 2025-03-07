import { EventState } from '@pontozo/common'
import { Navigate, useParams } from 'react-router-dom'
import { useFetchEvent } from 'src/api/hooks/eventQueryHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'

export const EventRedirectPage = () => {
  const { eventId } = useParams()
  const { data, isLoading, error } = useFetchEvent(+eventId!)
  if (error) return <NavigateWithError error={error} to={PATHS.INDEX} />
  if (isLoading || !data) return <LoadingSpinner />
  if (data.event.state === EventState.RESULTS_READY) return <Navigate replace to={`${PATHS.RESULTS}/${eventId}`} />
  return <Navigate replace to={`${PATHS.EVENTS}/${eventId}`} />
}

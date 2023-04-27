import { SimpleGrid, Spinner } from '@chakra-ui/react'
import OAuth2Login from 'react-simple-oauth2-login'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFetchEventsLastMonth } from '../../api/hooks/eventQueryHooks'
import { CLIENT_ID, FUNC_HOST } from '../../util/environment'
import { EventListItem } from './components/EventListItem'

export const IndexPage = () => {
  const { data: events, isLoading, error } = useFetchEventsLastMonth()
  const { onLoginSuccess, isLoggedIn, loggedInUser } = useAuthContext()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }
  const onSuccess = (response: Record<string, any>) => {
    console.log(response)
    onLoginSuccess(response as unknown as string)
  }
  const onFailure = (response: Record<string, any>) => console.error(response)

  return (
    <SimpleGrid spacing={4} columns={2}>
      {events
        ?.sort((e1, e2) => -e1.datum_tol.localeCompare(e2.datum_tol))
        .map((e) => (
          <EventListItem key={e.esemeny_id} event={e} />
        ))}

      <OAuth2Login
        authorizationUrl="https://api.mtfsz.hu/oauth/v2/auth"
        responseType="code"
        clientId={CLIENT_ID}
        redirectUri={`${FUNC_HOST}/auth/callback`}
        onSuccess={onSuccess}
        onFailure={onFailure}
        isCrossOrigin
      />
      {isLoggedIn && <h1>{loggedInUser?.nev}</h1>}
    </SimpleGrid>
  )
}

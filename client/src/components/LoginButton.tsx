import { PropsWithChildren, ReactElement } from 'react'
import OAuth2Login from 'react-simple-oauth2-login'
import { useAuthContext } from '../api/contexts/useAuthContext'
import { CLIENT_ID, FUNC_HOST } from '../util/environment'

type Props = {
  renderLoginButton: (props: { buttonText: string; onClick: () => void }) => ReactElement
} & PropsWithChildren

export const LoginButton = ({ renderLoginButton, children }: Props) => {
  const { isLoggedIn, onLoginSuccess } = useAuthContext()

  const onSuccess = (response: Record<string, any>) => {
    onLoginSuccess(response as unknown as string)
  }
  const onFailure = (response: Record<string, any>) => console.error(response)

  return !isLoggedIn ? (
    <OAuth2Login
      authorizationUrl="https://api.mtfsz.hu/oauth/v2/auth"
      responseType="code"
      clientId={CLIENT_ID}
      redirectUri={`${FUNC_HOST}/api/auth/callback`}
      onSuccess={onSuccess}
      onFailure={onFailure}
      buttonText="Bejelentkezés"
      isCrossOrigin
      render={renderLoginButton}
    />
  ) : (
    <>{children}</>
  )
}

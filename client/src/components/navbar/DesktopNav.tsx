import { Button, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import OAuth2Login from 'react-simple-oauth2-login'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { CLIENT_ID, FUNC_HOST } from '../../util/environment'
import { navItems } from '../../util/navItems'

const DesktopNav = () => {
  const { isLoggedIn, onLoginSuccess, onLogout } = useAuthContext()

  const onSuccess = (response: Record<string, any>) => {
    onLoginSuccess(response as unknown as string)
  }
  const onFailure = (response: Record<string, any>) => console.error(response)

  const renderLoginButton = (props: { className: string; buttonText: string; onClick: () => void }) => (
    <Button flexDir="column" alignItems="center" px={2} py={4} variant="ghost" colorScheme="brand" onClick={props.onClick}>
      {props.buttonText}
    </Button>
  )

  return (
    <Stack direction="row" spacing={4}>
      {navItems.map((item) => (
        <Button
          flexDir="column"
          alignItems="center"
          key={item.label}
          as={Link}
          to={item.path}
          px={2}
          py={4}
          variant="ghost"
          colorScheme="brand"
        >
          {item.label}
        </Button>
      ))}
      {!isLoggedIn ? (
        <OAuth2Login
          authorizationUrl="https://api.mtfsz.hu/oauth/v2/auth"
          responseType="code"
          clientId={CLIENT_ID}
          redirectUri={`${FUNC_HOST}/auth/callback`}
          onSuccess={onSuccess}
          onFailure={onFailure}
          buttonText="Bejelentkezés"
          isCrossOrigin
          render={renderLoginButton}
        />
      ) : (
        <Button flexDir="column" alignItems="center" px={2} py={4} onClick={() => onLogout()} variant="ghost" colorScheme="brand">
          Kijelentkezés
        </Button>
      )}
    </Stack>
  )
}

export default DesktopNav

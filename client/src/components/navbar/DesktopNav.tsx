import { Button, Stack } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { LoginButton } from '../LoginButton'

const DesktopNav = () => {
  const { pathname } = useLocation()
  const { onLogout } = useAuthContext()
  const navItemsToRender = pathname.startsWith('/admin') ? adminNavItems : navItems

  const renderLoginButton = (props: { buttonText: string; onClick: () => void }) => (
    <Button flexDir="column" alignItems="center" px={2} py={4} variant="ghost" colorScheme="brand" onClick={props.onClick}>
      {props.buttonText}
    </Button>
  )

  return (
    <Stack direction="row" spacing={4}>
      {navItemsToRender.map((item) => (
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
      <LoginButton renderLoginButton={renderLoginButton}>
        <Button flexDir="column" alignItems="center" px={2} py={4} onClick={() => onLogout()} variant="ghost" colorScheme="brand">
          Kijelentkezés
        </Button>
      </LoginButton>
    </Stack>
  )
}

export default DesktopNav

import { Button, Stack } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { onLoginClick } from '../../util/onLoginClick'

const DesktopNav = () => {
  const { pathname } = useLocation()
  const { isLoggedIn, isAdmin } = useAuthContext()
  const navItemsToRender = (pathname.startsWith('/admin') ? adminNavItems : navItems).filter((navItem) =>
    navItem.shown(isLoggedIn, isAdmin)
  )

  return (
    <Stack direction="row" spacing={4}>
      {navItemsToRender.map((item) => (
        <Button flexDir="column" alignItems="center" key={item.label} as={Link} to={item.path} px={2} py={4} variant="ghost">
          {item.label}
        </Button>
      ))}
      {!isLoggedIn && (
        <Button flexDir="column" alignItems="center" px={2} py={4} onClick={onLoginClick} variant="ghost">
          Bejelentkezés
        </Button>
      )}
    </Stack>
  )
}

export default DesktopNav

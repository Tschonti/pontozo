import { Stack } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { onLoginClick } from '../../util/onLoginClick'
import { NavbarButton } from '../commons/NavbarButton'

const DesktopNav = () => {
  const { pathname } = useLocation()
  const { isLoggedIn, isAdmin } = useAuthContext()
  const navItemsToRender = (pathname.startsWith('/admin') ? adminNavItems : navItems).filter((navItem) =>
    navItem.shown(isLoggedIn, isAdmin)
  )
  const nav = useNavigate()

  return (
    <Stack direction="row" spacing={4}>
      {navItemsToRender.map((item) => (
        <NavbarButton key={item.label} onClick={() => nav(item.path)} active={item.path === pathname}>
          {item.label}
        </NavbarButton>
      ))}
      {!isLoggedIn && (
        <NavbarButton onClick={onLoginClick} active={false}>
          BEJELENTKEZÉS
        </NavbarButton>
      )}
    </Stack>
  )
}

export default DesktopNav

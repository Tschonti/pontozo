import { Stack, useDisclosure } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { LoginModal } from '../commons/LoginModal'
import { NavbarButton } from '../commons/NavbarButton'

const DesktopNav = () => {
  const { pathname } = useLocation()
  const { isOpen, onClose, onOpen } = useDisclosure()
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
        <NavbarButton onClick={onOpen} active={false}>
          BEJELENTKEZÉS
        </NavbarButton>
      )}
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  )
}

export default DesktopNav

import { HStack, Stack, Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { onLoginClick } from 'src/util/onLoginClick'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'

type Props = {
  onNavigate: () => void
}

const MobileNav = ({ onNavigate }: Props) => {
  const { pathname } = useLocation()
  const { isLoggedIn, isAdmin } = useAuthContext()
  const navItemsToRender = (pathname.startsWith('/admin') ? adminNavItems : navItems).filter((navItem) =>
    navItem.shown(isLoggedIn, isAdmin)
  )

  return (
    <Stack display={{ lg: 'none' }} fontWeight={700} fontSize="xl" ml={6} mb={6}>
      {navItemsToRender.map((item) => (
        <HStack
          color={pathname === item.path ? 'mtfszYellow' : 'white'}
          key={item.label}
          as={Link}
          to={item.path}
          onClick={() => onNavigate()}
        >
          <Text textAlign="center">{item.label}</Text>
        </HStack>
      ))}
      {!isLoggedIn && (
        <HStack cursor="pointer" onClick={onLoginClick} color="white">
          <Text textAlign="center">BEJELENTKEZÉS</Text>
        </HStack>
      )}
    </Stack>
  )
}

export default MobileNav

import { HStack, Stack, Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { onLoginClick } from '../../util/onLoginClick'

type Props = {
  onNavigate: () => void
}

const MobileNav = ({ onNavigate }: Props) => {
  const { pathname } = useLocation()
  const { onLogout, isLoggedIn } = useAuthContext()
  const navItemsToRender = pathname.startsWith('/admin') ? adminNavItems : navItems

  return (
    <Stack display={{ lg: 'none' }} fontWeight={700} fontSize="xl" ml={6} mb={6}>
      {navItemsToRender.map((item) => (
        <HStack key={item.label} as={Link} to={item.path} onClick={() => onNavigate()}>
          <Text textAlign="center">{item.label}</Text>
        </HStack>
      ))}
      {isLoggedIn ? (
        <HStack cursor="pointer" onClick={() => onLogout()}>
          <Text textAlign="center">Kijelentkezés</Text>
        </HStack>
      ) : (
        <HStack cursor="pointer" onClick={onLoginClick}>
          <Text textAlign="center">Bejelentkezés</Text>
        </HStack>
      )}
    </Stack>
  )
}

export default MobileNav

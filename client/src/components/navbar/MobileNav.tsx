import { HStack, Stack, Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { adminNavItems, navItems } from '../../util/navItems'
import { LoginButton } from '../LoginButton'

type Props = {
  onNavigate: () => void
}

const MobileNav = ({ onNavigate }: Props) => {
  const { pathname } = useLocation()
  const { onLogout } = useAuthContext()
  const navItemsToRender = pathname.startsWith('/admin') ? adminNavItems : navItems

  const renderLoginButton = (props: { buttonText: string; onClick: () => void }) => (
    <HStack cursor="pointer" onClick={props.onClick}>
      <Text textAlign="center">{props.buttonText}</Text>
    </HStack>
  )

  return (
    <Stack display={{ lg: 'none' }} fontWeight={700} fontSize="xl" ml={6} mb={6}>
      {navItemsToRender.map((item) => (
        <HStack key={item.label} as={Link} to={item.path} onClick={() => onNavigate()}>
          <Text textAlign="center">{item.label}</Text>
        </HStack>
      ))}
      <LoginButton renderLoginButton={renderLoginButton}>
        <HStack cursor="pointer" onClick={() => onLogout()}>
          <Text textAlign="center">Kijelentkezés</Text>
        </HStack>
      </LoginButton>
    </Stack>
  )
}

export default MobileNav

import { HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { navItems } from '../../util/navItems'

type Props = {
  onNavigate: () => void
}

const MobileNav = ({ onNavigate }: Props) => {
  return (
    <Stack display={{ lg: 'none' }} fontWeight={700} fontSize="xl" ml={6} mb={6}>
      {navItems.map((item) => (
        <HStack key={item.label} as={Link} to={item.path} onClick={() => onNavigate()}>
          <Text textAlign="center" color={useColorModeValue('brand.700', 'white')}>
            {item.label}
          </Text>
        </HStack>
      ))}
    </Stack>
  )
}

export default MobileNav

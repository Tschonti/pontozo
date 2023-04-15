import { Button, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { navItems } from '../../util/navItems'

const DesktopNav = () => {
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
    </Stack>
  )
}

export default DesktopNav

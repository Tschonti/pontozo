import { Box, Collapse, Flex, Heading, IconButton, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { PATHS } from '../../util/paths'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export const Navbar: FC = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { isAdmin } = useAuthContext()
  const toast = useToast()
  const nav = useNavigate()
  const onNavigate = () => onToggle()
  const { pathname } = useLocation()
  const isAdminPath = pathname.startsWith('/admin')

  useEffect(() => {
    if (!isAdmin && isAdminPath) {
      toast({ status: 'error', title: 'Nincs jogosultságod az oldal megtekintéséhez!' })
      nav(PATHS.INDEX)
    }
  }, [isAdmin, isAdminPath])

  return (
    <Flex justifyContent="center" w="full" borderBottom="1px solid grey" mr={5}>
      <Box mx="auto" maxW="6xl" w="full" color={useColorModeValue('brand.500', 'white')}>
        <Flex h="4rem" w="full" px={4} py={2} align="center" justifyContent="space-between">
          <Heading as={Link} to={PATHS.INDEX} _hover={{ textDecoration: 'none' }}>
            Pontoz-O {isAdminPath && 'Admin'}
          </Heading>
          <Flex display={{ base: 'flex', lg: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <FaTimes size="1.5rem" /> : <FaBars size="1.5rem" />}
              variant="ghost"
              aria-label="Open navigation"
            />
          </Flex>
          <Flex display={{ base: 'none', lg: 'flex' }} flex={1} justifyContent="center">
            <DesktopNav />
          </Flex>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav onNavigate={onNavigate} />
        </Collapse>
      </Box>
    </Flex>
  )
}

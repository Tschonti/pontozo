import { Box, Collapse, Flex, Heading, IconButton, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { PATHS } from '../../util/paths'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { isAdmin, loggedInUserLoading } = useAuthContext()
  const toast = useToast()
  const nav = useNavigate()
  const onNavigate = () => onToggle()
  const { pathname } = useLocation()
  const isAdminPath = pathname.startsWith('/admin')

  useEffect(() => {
    if (!isAdmin && isAdminPath && !loggedInUserLoading) {
      toast({ status: 'error', title: 'Nincs jogosultságod az oldal megtekintéséhez!' })
      nav(PATHS.INDEX)
    }
  }, [isAdmin, isAdminPath, loggedInUserLoading])

  return (
    <Flex justifyContent="center" w="full" borderBottom="1px solid grey" mr={5}>
      <Box mx="auto" maxW="6xl" w="full">
        <Flex h="4rem" w="full" px={4} py={2} align="center" justifyContent="space-between">
          <Heading as={Link} to={isAdminPath ? PATHS.ADMIN : PATHS.INDEX} _hover={{ textDecoration: 'none' }}>
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

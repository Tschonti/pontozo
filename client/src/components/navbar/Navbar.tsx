import { Box, Collapse, Flex, IconButton, Image, useDisclosure, useToast } from '@chakra-ui/react'
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
    <>
      <Flex direction="column">
        <Box flex={1}>
          <Flex flexDirection="column" maxWidth={['100%', '48rem', '48rem', '64rem']} mx="auto">
            <Box as={Link} to={PATHS.INDEX} p={4}>
              <Image src="img/logo.png" />
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Flex justifyContent="center" w="full" mr={5} bgColor={isAdminPath ? 'mtfszRed' : 'brand.500'}>
        <Box mx="auto" maxW="6xl" w="full">
          <Flex w="full" px={4} align="center" justifyContent="flex-end">
            <Flex display={{ base: 'flex', lg: 'none' }}>
              <IconButton
                p={2}
                onClick={onToggle}
                color="white"
                icon={isOpen ? <FaTimes size="1.5rem" /> : <FaBars size="1.5rem" />}
                variant="unstyled"
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
    </>
  )
}

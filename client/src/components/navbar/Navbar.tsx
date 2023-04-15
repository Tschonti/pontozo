import { Box, Collapse, Flex, Heading, IconButton, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { FC } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { PATHS } from '../../util/paths'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'

export const Navbar: FC = () => {
  const { isOpen, onToggle } = useDisclosure()
  const onNavigate = () => onToggle()

  return (
    <Flex justifyContent="center" w="full" borderBottom="1px solid grey" mr={5}>
      <Box mx="auto" maxW="6xl" w="full" color={useColorModeValue('brand.500', 'white')}>
        <Flex h="4rem" w="full" px={4} py={2} align="center" justifyContent="space-between">
          <Heading as={Link} to={PATHS.INDEX} _hover={{ textDecoration: 'none' }}>
            Pontoz-O
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

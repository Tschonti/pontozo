import { Box, Container, Flex, HStack, Link, Stack, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa'
import { HashLink } from 'react-router-hash-link'
import { ColorfulExternalLink } from './commons/ColorfulExternalLink'

export const Footer: FC = () => {
  return (
    <Box as="footer" borderTop="1px" borderTopColor="gray.300" bg="white">
      <Container
        py={5}
        as={Flex}
        alignItems={{ base: 'center', md: 'flex-end' }}
        justifyContent="space-around"
        direction={{ base: 'column', md: 'row' }}
        maxW="6xl"
      >
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2} justify="center" align="center">
          <Text textAlign="center">
            Készítette:{' '}
            <Link href="https://github.com/Tschonti" color="brand.500" isExternal>
              Fekete Sámuel
            </Link>{' '}
            az{' '}
            <Link href="https://mtfsz.hu" color="brand.500" isExternal>
              MTFSZ
            </Link>{' '}
            megbízásából.{' '}
            <HashLink to="/faq#impressum" style={{ color: '#0a723a' }}>
              Impresszum
            </HashLink>
          </Text>
        </Stack>

        <HStack mt={{ base: 2, md: 0 }} spacing={2} justify="space-evenly">
          <Text textAlign="center">&copy; {new Date().getFullYear()}</Text>
          <ColorfulExternalLink url="https://github.com/Tschonti/pontozo" hoverColor="brand.500">
            <FaGithub size={25} />
          </ColorfulExternalLink>
          <ColorfulExternalLink url="https://github.com/Tschonti" hoverColor="brand.500">
            <FaGlobe size={25} />
          </ColorfulExternalLink>
          <ColorfulExternalLink url="mailto:feketesamu@gmail.com" hoverColor="brand.500">
            <FaEnvelope size={25} />
          </ColorfulExternalLink>
          <ColorfulExternalLink url="https://www.linkedin.com/in/samuel-fekete/" hoverColor="brand.500">
            <FaLinkedin size={25} />
          </ColorfulExternalLink>
        </HStack>
      </Container>
    </Box>
  )
}

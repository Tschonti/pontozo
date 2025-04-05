import { Box, Container, Flex, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa'
import { ColorfulExternalLink } from './commons/ColorfulExternalLink'
import { ColorfulHashLink } from './commons/ColorfulHashLink'

export const Footer: FC = () => {
  return (
    <Box as="footer" borderTop="1px" borderTopColor="gray.300" bg="white">
      <Container
        py={5}
        as={Flex}
        alignItems="center"
        justifyContent="space-around"
        direction={{ base: 'column', md: 'row' }}
        maxW="6xl"
        gap={2}
      >
        <VStack spacing={0} justify="center" align="center">
          <ColorfulHashLink to="/faq#privacy-notice">Adatkezelési tájékoztató</ColorfulHashLink>
          <ColorfulHashLink to="/faq#cookie-notice">Süti tájékoztató</ColorfulHashLink>
          <ColorfulHashLink to="/faq#impressum">Impresszum</ColorfulHashLink>
        </VStack>

        <VStack spacing={0}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={0} justify="center" align="center">
            <Text textAlign="center">
              Készítette:{' '}
              <Link href="https://github.com/Tschonti" color="brand.500" isExternal>
                Fekete Sámuel
              </Link>{' '}
              az{' '}
              <Link href="https://mtfsz.hu" color="brand.500" isExternal>
                MTFSZ
              </Link>{' '}
              megbízásából.
            </Text>
          </Stack>
          <Text textAlign="center">&copy; 2023-{new Date().getFullYear()}</Text>

          <HStack mt={2} spacing={2} justify="space-evenly">
            <ColorfulExternalLink url="https://github.com/Tschonti/pontozo" hoverColor="brand.500">
              <FaGithub size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="https://github.com/Tschonti" hoverColor="brand.500">
              <FaGlobe size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="mailto:pontozo@mtfsz.hu" hoverColor="brand.500">
              <FaEnvelope size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="https://www.linkedin.com/in/samuel-fekete/" hoverColor="brand.500">
              <FaLinkedin size={25} />
            </ColorfulExternalLink>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

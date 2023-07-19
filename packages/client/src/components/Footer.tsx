import { Box, Container, Flex, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa'
import { ColorfulExternalLink } from './commons/ColorfulExternalLink'

export const Footer: FC = () => {
  return (
    <Box as="footer" borderTop="1px" borderTopColor="gray.300">
      <Container py={8} as={Flex} align="center" justifyContent="space-evenly" direction={{ base: 'column', m: 'row' }} maxW="6xl">
        <VStack>
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
              megbízásából.
            </Text>
          </Stack>

          <HStack spacing={2} mt={4} justify="space-evenly">
            <Text textAlign="center">&copy; {new Date().getFullYear()}</Text>
            <ColorfulExternalLink url="https://github.com/Tschonti/pontozo" hoverColor="brand.500">
              <FaGithub size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="https://github.com/Tschonti" hoverColor="brand.500">
              <FaGlobe size={25} />
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

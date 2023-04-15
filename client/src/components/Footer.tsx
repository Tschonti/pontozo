import { Box, Container, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa'
import { ColorfulExternalLink } from './commons/ColorfulExternalLink'

export const Footer: FC = () => {
  return (
    <Box as="footer" borderTop="1px solid gray">
      <Container py={8} as={Flex} align="center" justifyContent="space-evenly" direction={{ base: 'column', m: 'row' }} maxW="6xl">
        <VStack>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={2} justify="center" align="center">
            <Text textAlign="center">
              Készítette:{' '}
              <ColorfulExternalLink url="https://github.com/Tschonti" hoverColor="green">
                Fekete Sámuel
              </ColorfulExternalLink>{' '}
              az{' '}
              <ColorfulExternalLink url="https://mtfsz.hu" hoverColor="green">
                MTFSZ
              </ColorfulExternalLink>{' '}
              megbízásából.
            </Text>
          </Stack>
          <Text textAlign="center">&copy; {new Date().getFullYear()}</Text>

          <HStack spacing={2} mt={4} justify="space-evenly">
            <ColorfulExternalLink url="https://github.com/Tschonti/pontozo" hoverColor="green">
              <FaGithub size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="https://github.com/Tschonti" hoverColor="green">
              <FaGlobe size={25} />
            </ColorfulExternalLink>
            <ColorfulExternalLink url="https://www.linkedin.com/in/samuel-fekete/" hoverColor="green">
              <FaLinkedin size={25} />
            </ColorfulExternalLink>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

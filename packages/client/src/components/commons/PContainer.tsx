import { Flex } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export const PContainer = ({ children }: PropsWithChildren) => (
  <Flex flexDirection="column" px={4} py={4} mx="auto" maxWidth={['100%', '48rem', '48rem', '64rem']}>
    {children}
  </Flex>
)

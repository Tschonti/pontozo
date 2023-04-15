import { Box, Flex } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { Footer } from '../Footer'
import { Navbar } from '../navbar/Navbar'
import { PContainer } from './PContainer'
import { ScrollToTop } from './ScrollToTop'

export const PLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <Helmet titleTemplate="Pontoz-O | %s" defaultTitle="Pontoz-O" /> */}
      <ScrollToTop />
      <Flex direction="column" minHeight="100vh">
        <Navbar />
        <Box flex={1} pb={15}>
          <PContainer>{children}</PContainer>
        </Box>
        <Footer />
      </Flex>
    </>
  )
}

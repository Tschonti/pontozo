import { Box } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

type Props = {
  onClick: () => void
  active: boolean
} & PropsWithChildren

export const NavbarButton = ({ children, onClick, active }: Props) => {
  return (
    <Box
      as="button"
      color={active ? 'mtfszYellow' : 'white'}
      fontWeight="bold"
      borderBottom={active ? '2px' : undefined}
      _hover={{ color: 'mtfszYellow', borderBottom: '4px', marginBottom: '0px', padding: '12px' }}
      flexDir="column"
      alignItems="center"
      p="12px"
      pb={active ? '14px' : '12px'}
      mb={active ? undefined : '4px'}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}

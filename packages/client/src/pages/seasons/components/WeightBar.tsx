import { Box, HStack } from '@chakra-ui/react'

type Props = {
  greenPercent: number
  redPercent: number
}

export const WeightBar = ({ greenPercent, redPercent }: Props) => {
  return (
    <HStack width="100%" gap={0} display={{ base: 'none', lg: 'flex' }}>
      <Box roundedLeft="sm" roundedRight={redPercent === 0 ? 'sm' : undefined} width={`${greenPercent}%`} bg="brand.500" height={6} />
      <Box roundedRight="sm" roundedLeft={greenPercent === 0 ? 'sm' : undefined} width={`${redPercent}%`} bg="mtfszRed" height={6} />
    </HStack>
  )
}

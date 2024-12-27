import { Button, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchSeasonWeights } from 'src/api/hooks/seasonHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { PATHS } from 'src/util/paths'
import { CategoryWeights } from './components/CategoryWeights'

export const WeightAdjustmentPage = () => {
  const { seasonId } = useParams()
  const { isLoading, data } = useFetchSeasonWeights(seasonId)
  const nav = useNavigate()

  if (isLoading || !data) return <LoadingSpinner />
  return (
    <VStack alignItems="flex-start">
      <HStack justify="space-between" w="100%" alignItems="center">
        <Heading>{data.name} szezon súlyainak beállítása</Heading>
        <Button leftIcon={<FaEdit />} colorScheme="brand" onClick={() => nav(`${PATHS.SEASONS}/${seasonId}/edit`)}>
          Szeszon szerkesztése
        </Button>
      </HStack>

      <Text>Blablabla</Text>
      <SimpleGrid alignItems="center" templateColumns="8fr 1fr 1fr" columnGap={2} rowGap={1} width={{ base: '100%', lg: '70%' }}>
        {data.categories.map((c) => (
          <CategoryWeights key={c.id} category={c} seasonId={seasonId ?? ''} />
        ))}
      </SimpleGrid>
    </VStack>
  )
}

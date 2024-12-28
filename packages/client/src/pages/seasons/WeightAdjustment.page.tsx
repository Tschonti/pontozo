import { Button, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { FaEdit, FaMedal } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchSeasonWeights } from 'src/api/hooks/seasonHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { criterionWeightReducer } from 'src/util/criterionWeightHelper'
import { PATHS } from 'src/util/paths'
import { CategoryWeights } from './components/CategoryWeights'

export const WeightAdjustmentPage = () => {
  const { seasonId } = useParams()
  const { isLoading, data } = useFetchSeasonWeights(seasonId)
  const nav = useNavigate()

  const totalWeightSum = useMemo(() => {
    if (!data) return 0
    return data.categories.reduce((catSum, category) => catSum + category.criteria.reduce(criterionWeightReducer('both'), 0), 0)
  }, [data])

  const maxCategory = useMemo(() => {
    if (!data) return 0
    return data.categories.reduce((max, category) => {
      const sum = category.criteria.reduce(criterionWeightReducer('both'), 0)
      if (sum > max) return sum
      return max
    }, 0)
  }, [data])

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
      <VStack gap={1} alignItems="flex-start">
        <Text>
          <b>(V)</b> - Teljes versenyre vonatkozó szempont/kategória
        </Text>
        <Text>
          <b>(F)</b> - Futamra vonatkozó szempont/kategória
        </Text>
        <HStack>
          <FaMedal />
          <Text>- Csak országos és kiemelt rangsoló versenyekre vonatkozó szempont</Text>
        </HStack>
      </VStack>
      <SimpleGrid
        bg="gray.100"
        padding={2}
        rounded="md"
        alignItems="center"
        templateColumns={{ base: '19fr 2fr 2fr', lg: '19fr 2fr 2fr 10fr' }}
        width="100%"
        columnGap={2}
        rowGap={1}
      >
        <Text>
          <b>Szempont neve</b>
        </Text>
        <Text color="brand.500" textAlign="center">
          <b>
            Versenyző, <br />
            Edző
            <br />
            súlya
          </b>
        </Text>
        <Text color="mtfszRed" textAlign="center">
          <b>
            Rendező, <br />
            Zsűri
            <br />
            súlya
          </b>
        </Text>
        <Text textAlign="center" display={{ base: 'none', lg: 'block' }}>
          <b>Súlyok teljes összege: {totalWeightSum.toFixed(2)}</b>
        </Text>
      </SimpleGrid>
      <SimpleGrid
        alignItems="center"
        templateColumns={{ base: '1fr 18fr 2fr 2fr', lg: '1fr 18fr 2fr 2fr 10fr' }}
        width="100%"
        columnGap={2}
        rowGap={1}
      >
        {data.categories.map((c) => (
          <CategoryWeights key={c.id} category={c} seasonId={seasonId ?? ''} totalWeightSum={maxCategory} />
        ))}
      </SimpleGrid>
    </VStack>
  )
}

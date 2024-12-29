import { Alert, AlertDescription, AlertIcon, Button, Heading, HStack, SimpleGrid, Stack, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { FaEdit, FaMedal, FaRedoAlt } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchSeasonWeights } from 'src/api/hooks/seasonHooks'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { criterionWeightReducer } from 'src/util/criterionWeightHelper'
import { PATHS } from 'src/util/paths'
import { CategoryWeights } from './components/CategoryWeights'
import { SourceSeasonSelectorModal } from './components/SourceSeasonSelectorModal'

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
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" w="100%" alignItems={{ base: 'flex-start', md: 'center' }}>
        <Heading>{data.name} szezon súlyainak beállítása</Heading>
        <Button
          width={{ base: '100%', md: 'auto' }}
          leftIcon={<FaEdit />}
          colorScheme="brand"
          onClick={() => nav(`${PATHS.SEASONS}/${seasonId}/edit`)}
        >
          Szeszon szerkesztése
        </Button>
      </Stack>

      <Alert status="warning" display={{ base: 'flex', md: 'none' }}>
        <AlertIcon />
        <AlertDescription>
          Ezt az oldalt lehetőleg egy nagyobb képernyőről használd, sajnos mobiltelefonra nehezen optimalizálható!
        </AlertDescription>
      </Alert>
      <Heading mt={4} size="md" as="h2">
        Tudnivalók
      </Heading>
      <Text textAlign="justify">
        Egy verseny értékeléseinek összesítésekor nem érdemes minden szempontra érkező értékelést ugyanakkora súllyal számolni, hiszen
        például sokkal fontosabb a pályák vagy a térképek minősége, mint a kiegészítő szolgáltatások. Ugyanígy egyes felhasználók (pl.
        ellenőrzőbíró) értékelését is tekinthetjük értékesebbnek. Ezen az oldalon tudod beállítani, hogy az adott szezonban milyen
        súlyozásai legyenek az egyes szempontoknak, szerepköröknek, amik alapján a végleges pontszám számolódik.
      </Text>
      <Text textAlign="justify">
        Az itt megadott súlyértékek nem egy adott felhasználó értékelésére vonatkoznak, hanem az adott szerepkörben leadott értékelések
        átlagára. Nézzünk egy példát: egy szempontot 10 versenyző értékelt, átlagosan 2,5-ra, valamint 5 rendező, 1,5-re. Ha a versenyzői
        súly 2, míg a rendezői súly 3, a végleges összpontszám a következőképp alakul: <b>(2 * 2,5 + 3 * 1,5)/(2 + 3) = 1,9</b>. (Amennyiben
        minden értékelésnek azonos súlya lenne, az átlag 2,167 lenne. Mivel a rendezőknek nagyobb súlya volt és átlagosan rosszabbul
        értékelték, a pontszám is alacsonyabb lett.) A versenyzőket és az edzőket (akik nem feltétlen indultak el a versenyen, de
        tanítványaik alapján van benyomásuk) egyenrangúnak tartjuk, ugyanígy a rendezőket és MTFSZ Zsűriket is.
      </Text>

      <Text textAlign="justify">
        Fontos megemlíteni a futamspecifikus szempontokat, ezeket minden felhasználó futamonkénti értékeli. Az összpontszám számításakor az
        egyes futamokra érkezett értékelések átlagolásra kerülnek a súlyok alkalmazása előtt, minden futam azonos súllyal számít.
      </Text>

      <Text textAlign="justify">
        <b>
          Az oldalon egy érték átírása azonnal átírja az értéket az adatbázisban, nem kell semmilyen mentés gombra kattintani. Azonban az
          értékelések eredményei nem számolódnak újra minden súlyérték változásakor, csakis ha azt manuálisan elindítod (coming soon).
        </b>
      </Text>

      <Heading mt={4} size="md" as="h2">
        Műveletek
      </Heading>
      <HStack gap={2}>
        <SourceSeasonSelectorModal currentSeasonId={seasonId ?? ''} />
        <Button isDisabled colorScheme="red" leftIcon={<FaRedoAlt />}>
          Pontok újraszámítása
        </Button>
      </HStack>

      <Heading mt={4} size="md" as="h2">
        Jelmagyarázat
      </Heading>
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
          <Tooltip
            placement="top"
            hasArrow
            label="Az összes versenyző és edző szerepkörben értékelt felhasználó értékelései ilyen súllyal fognak az összpontszámba számítani."
          >
            <b>
              Versenyző <br />
              Edző
            </b>
          </Tooltip>
        </Text>
        <Text color="mtfszRed" textAlign="center">
          <Tooltip
            placement="top"
            hasArrow
            label="Az összes rendező és MTFSZ Zsűri szerepkörben értékelt felhasználó értékelései ilyen súllyal fognak az összpontszámba számítani."
          >
            <b>
              Rendező <br />
              Zsűri
            </b>
          </Tooltip>
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

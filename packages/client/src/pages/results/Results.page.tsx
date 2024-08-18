import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Heading,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, RatingRole } from '@pontozo/common'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useFetchEventResultsMutation, useFetchSeasonsMutation } from 'src/api/hooks/resultHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { AgeGroupRoleSelector } from './components/AgeGroupRoleSelector'
import { EventResultTable } from './components/EventResultTable'

export const ResultsPage = () => {
  const resultsMutation = useFetchEventResultsMutation()
  const seasonsMutation = useFetchSeasonsMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [storedCriterionIds, setStoredCriterionIds] = useState<number[]>([])
  const [storedCategoryIds, setStoredCategoryIds] = useState<number[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<number>()
  const [selectedRoles, setSelectedRoles] = useState<RatingRole[]>(ALL_ROLES)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>(ALL_AGE_GROUPS)
  const [nationalOnly, setNationalOnly] = useState(false)
  const [includeTotal, setIncludeTotal] = useState(true)
  const [storedIncludeTotal, setStoredIncludeTotal] = useState(true)
  const selectCritCount = selectedCategoryIds.length + selectedCriterionIds.length + (includeTotal ? 1 : 0)
  const toast = useToast()

  useEffect(() => {
    seasonsMutation.mutate(undefined)
    resultsMutation.mutate({ categoryIds: [], criterionIds: [], nationalOnly: false, includeTotal: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
  }

  const showToast = () => {
    const toastId = 'max-crit-reached-warning'
    if (!toast.isActive(toastId)) {
      toast({ id: toastId, title: 'Maximum 5 szempont jeleníthető meg egyszerre!', status: 'warning' })
    }
  }

  const categoryCheckChange = (event: ChangeEvent, categoryId: number) => {
    if ((event.target as HTMLInputElement).checked) {
      if (selectCritCount > 4) return showToast()
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    } else {
      setSelectedCategoryIds(selectedCategoryIds.filter((cId) => cId !== categoryId))
    }
  }

  const criterionCheckChange = (event: ChangeEvent, criterrionId: number) => {
    if ((event.target as HTMLInputElement).checked) {
      if (selectCritCount > 4) return showToast()
      setSelectedCriterionIds([...selectedCriterionIds, criterrionId])
    } else {
      setSelectedCriterionIds(selectedCriterionIds.filter((cId) => cId !== criterrionId))
    }
  }

  const sendResultRequest = (national?: boolean) => {
    resultsMutation.mutate({
      seasonId: selectedSeasonId,
      categoryIds: selectedCategoryIds,
      criterionIds: selectedCriterionIds,
      nationalOnly: national ?? nationalOnly,
      includeTotal,
    })
  }

  const saveSelectedIds = () => {
    sendResultRequest()
    onClose()
  }

  const selectedSeasonChange = (event: ChangeEvent) => {
    const newSeasonId = parseInt((event.target as HTMLInputElement).value)
    setSelectedSeasonId(newSeasonId)
    seasonsMutation.mutate(newSeasonId)
    resultsMutation.mutate({
      seasonId: newSeasonId,
      categoryIds: [],
      criterionIds: [],
      nationalOnly: nationalOnly,
      includeTotal: true,
    })
    setSelectedCategoryIds([])
    setSelectedCriterionIds([])
    setIncludeTotal(true)
  }

  const ageGroupOrRoleSelectionChanged = (ageGroups: AgeGroup[], roles: RatingRole[]) => {
    setSelectedAgeGroups(ageGroups)
    setSelectedRoles(roles)
  }

  const nationalOnlyChange = (event: ChangeEvent) => {
    setNationalOnly(!nationalOnly)
    sendResultRequest((event.target as HTMLInputElement).checked)
  }

  const drawerOpened = () => {
    setStoredCategoryIds(selectedCategoryIds)
    setStoredCriterionIds(selectedCriterionIds)
    setStoredIncludeTotal(includeTotal)
    onOpen()
  }

  const drawerDismissed = () => {
    setSelectedCategoryIds(storedCategoryIds)
    setSelectedCriterionIds(storedCriterionIds)
    setIncludeTotal(storedIncludeTotal)
    onClose()
  }

  return (
    <>
      <HelmetTitle title="Pontoz-O" />
      <Heading my={5}>Értékelt versenyek</Heading>
      <Stack direction={['column', 'column', 'row']} gap={2}>
        <VStack gap={0.5} alignItems="flex-start" width={['100%', '100%', '33%']}>
          <FormLabel>Szezon</FormLabel>
          <Select bg="white" value={selectedSeasonId ?? seasonsMutation.data?.selectedSeason.id} onChange={selectedSeasonChange}>
            {seasonsMutation.data?.allSeasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </VStack>
        <AgeGroupRoleSelector
          selectedAgeGroups={selectedAgeGroups}
          selectedRoles={selectedRoles}
          onChange={ageGroupOrRoleSelectionChanged}
        />
      </Stack>
      <Stack my={2} direction={['column', 'column', 'row']} justify="space-between" gap={2}>
        <Checkbox colorScheme="brand" isChecked={nationalOnly} onChange={nationalOnlyChange}>
          Csak országos és kiemelt rangsoroló versenyek
        </Checkbox>
        <Button colorScheme="brand" onClick={drawerOpened}>
          Szempontok ({selectCritCount})
        </Button>
      </Stack>
      <Drawer isOpen={isOpen} placement="right" onClose={drawerDismissed} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Megjelenített szempontok</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" gap={1}>
              <Text mb={2}>
                Itt választhatod ki, mely szempontok és kategóriák szerint szeretnéd megtekinteni az értékelés eredményeit. A kategóriáknál
                a hozzá tartozó szempontok átlagai, az 'Összesített átlag' esetében pedig minden szempont átlaga fog megjelenni.
              </Text>
              <Checkbox colorScheme="brand" isChecked={includeTotal} onChange={() => setIncludeTotal(!includeTotal)}>
                <Text fontWeight="bold">Összesített átlag</Text>
              </Checkbox>
              {seasonsMutation.data?.selectedSeason.categories.map((c) => (
                <Fragment key={c.id}>
                  <Checkbox
                    colorScheme="brand"
                    isChecked={selectedCategoryIds.includes(c.id)}
                    onChange={(e) => categoryCheckChange(e, c.id)}
                  >
                    <Text fontWeight="bold">{c.name}</Text>
                  </Checkbox>
                  <VStack alignItems="flex-start" gap={1} ml={4}>
                    {c.criteria.map((cc) => (
                      <Checkbox
                        colorScheme="brand"
                        key={cc.id}
                        isChecked={selectedCriterionIds.includes(cc.id)}
                        onChange={(e) => criterionCheckChange(e, cc.id)}
                      >
                        {cc.name}
                      </Checkbox>
                    ))}
                  </VStack>
                </Fragment>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="gray" mr={3} onClick={drawerDismissed}>
              Mégse
            </Button>
            <Button colorScheme="brand" onClick={saveSelectedIds}>
              Alkalmaz
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {!resultsMutation.data || resultsMutation.isLoading ? (
        <LoadingSpinner />
      ) : (
        <EventResultTable results={resultsMutation.data} includeTotal={includeTotal} roles={selectedRoles} ageGroups={selectedAgeGroups} />
      )}
    </>
  )
}

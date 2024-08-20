import { Checkbox, FormLabel, Heading, Select, Stack, VStack } from '@chakra-ui/react'
import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, RatingRole } from '@pontozo/common'
import { ChangeEvent, useEffect, useState } from 'react'
import { useFetchEventResultsMutation, useFetchSeasonsMutation } from 'src/api/hooks/resultHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { PATHS } from 'src/util/paths'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { AgeGroupRoleSelector } from './components/AgeGroupRoleSelector'
import { CriteriaDrawer } from './components/CriteriaDrawer'
import { EventResultTable } from './components/table/EventResultTable'
import { EventFilter } from './types/EventFilter'

const FILTER_LS_KEY = 'FILTER_LS_KEY'

export const ResultsPage = () => {
  const resultsMutation = useFetchEventResultsMutation()
  const seasonsMutation = useFetchSeasonsMutation()
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<number>()
  const [selectedRoles, setSelectedRoles] = useState<RatingRole[]>(ALL_ROLES)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>(ALL_AGE_GROUPS)
  const [nationalOnly, setNationalOnly] = useState(false)
  const [includeTotal, setIncludeTotal] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(FILTER_LS_KEY)
    if (!saved) {
      seasonsMutation.mutate(undefined)
      resultsMutation.mutate({ categoryIds: [], criterionIds: [], nationalOnly: false, includeTotal: true })
    } else {
      const filterData: EventFilter = JSON.parse(saved)
      seasonsMutation.mutate(filterData.seasonId)
      resultsMutation.mutate({
        categoryIds: filterData.categoryIds,
        criterionIds: filterData.criterionIds,
        nationalOnly: filterData.nationalOnly,
        includeTotal: filterData.includeTotal,
      })
      setSelectedCategoryIds(filterData.categoryIds)
      setSelectedCriterionIds(filterData.criterionIds)
      setNationalOnly(filterData.nationalOnly)
      setIncludeTotal(filterData.includeTotal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveToLocalStorage = (newValue?: EventFilter) => {
    localStorage.setItem(
      FILTER_LS_KEY,
      JSON.stringify(
        newValue ?? {
          seasonId: seasonsMutation.data?.selectedSeason.id,
          categoryIds: selectedCategoryIds,
          criterionIds: selectedCriterionIds,
          nationalOnly: nationalOnly,
          includeTotal: includeTotal,
        }
      )
    )
  }

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
  }

  const sendResultRequest = (national?: boolean) => {
    const newValue = {
      seasonId: selectedSeasonId,
      categoryIds: selectedCategoryIds,
      criterionIds: selectedCriterionIds,
      nationalOnly: national ?? nationalOnly,
      includeTotal,
    }
    saveToLocalStorage(newValue)
    resultsMutation.mutate(newValue)
  }

  const selectedSeasonChange = (event: ChangeEvent) => {
    const newSeasonId = parseInt((event.target as HTMLInputElement).value)
    setSelectedSeasonId(newSeasonId)
    setSelectedCategoryIds([])
    setSelectedCriterionIds([])
    setIncludeTotal(true)
    saveToLocalStorage({ seasonId: newSeasonId, categoryIds: [], criterionIds: [], includeTotal: true, nationalOnly: false })

    seasonsMutation.mutate(newSeasonId)
    resultsMutation.mutate({
      seasonId: newSeasonId,
      categoryIds: [],
      criterionIds: [],
      nationalOnly: nationalOnly,
      includeTotal: true,
    })
  }

  const ageGroupOrRoleSelectionChanged = (ageGroups: AgeGroup[], roles: RatingRole[]) => {
    setSelectedAgeGroups(ageGroups)
    setSelectedRoles(roles)
  }

  const nationalOnlyChange = (event: ChangeEvent) => {
    setNationalOnly(!nationalOnly)
    sendResultRequest((event.target as HTMLInputElement).checked)
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
        {window.innerWidth < 768 ? (
          <CriteriaDrawer
            includeTotal={includeTotal}
            setIncludeTotal={setIncludeTotal}
            selectedCriterionIds={selectedCriterionIds}
            setSelectedCriterionIds={setSelectedCriterionIds}
            selectedCategoryIds={selectedCategoryIds}
            setSelectedCategoryIds={setSelectedCategoryIds}
            selectedSeason={seasonsMutation.data?.selectedSeason}
            onSave={sendResultRequest}
            isMobile
          />
        ) : (
          <CriteriaDrawer
            includeTotal={includeTotal}
            setIncludeTotal={setIncludeTotal}
            selectedCriterionIds={selectedCriterionIds}
            setSelectedCriterionIds={setSelectedCriterionIds}
            selectedCategoryIds={selectedCategoryIds}
            setSelectedCategoryIds={setSelectedCategoryIds}
            selectedSeason={seasonsMutation.data?.selectedSeason}
            onSave={sendResultRequest}
            isMobile={false}
          />
        )}
      </Stack>
      {!resultsMutation.data || resultsMutation.isLoading ? (
        <LoadingSpinner />
      ) : (
        <EventResultTable results={resultsMutation.data} includeTotal={includeTotal} roles={selectedRoles} ageGroups={selectedAgeGroups} />
      )}
    </>
  )
}

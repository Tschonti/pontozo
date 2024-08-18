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
    seasonsMutation.mutate(undefined)
    resultsMutation.mutate({ categoryIds: [], criterionIds: [], nationalOnly: false, includeTotal: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
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
        <CriteriaDrawer
          includeTotal={includeTotal}
          setIncludeTotal={setIncludeTotal}
          selectedCriterionIds={selectedCriterionIds}
          setSelectedCriterionIds={setSelectedCriterionIds}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
          selectedSeason={seasonsMutation.data?.selectedSeason}
          onSave={sendResultRequest}
        />
      </Stack>
      {!resultsMutation.data || resultsMutation.isLoading ? (
        <LoadingSpinner />
      ) : (
        <EventResultTable results={resultsMutation.data} includeTotal={includeTotal} roles={selectedRoles} ageGroups={selectedAgeGroups} />
      )}
    </>
  )
}

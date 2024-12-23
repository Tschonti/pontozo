import { Checkbox, FormLabel, Heading, Select, Stack, VStack } from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { AgeGroupRoleSelector } from './components/AgeGroupRoleSelector'
import { CriteriaDrawer } from './components/CriteriaDrawer'
import { EventResultTable } from './components/table/EventResultTable'

export const ResultsPage = () => {
  const { selectedSeasonId, seasonsData, selectedSeasonChange, nationalOnly, setNationalOnly, sendResultRequest, resultsLoading } =
    useResultTableContext()

  const nationalOnlyChange = (event: ChangeEvent) => {
    setNationalOnly(!nationalOnly)
    sendResultRequest((event.target as HTMLInputElement).checked)
  }

  return (
    <>
      <HelmetTitle title="Pontoz-O | Értékelt versenyek" />
      <Heading my={5}>Értékelt versenyek</Heading>
      <Stack direction={['column', 'column', 'row']} gap={2}>
        <VStack gap={0.5} alignItems="flex-start" width={['100%', '100%', '33%']}>
          <FormLabel>Szezon</FormLabel>
          <Select bg="white" value={selectedSeasonId ?? seasonsData?.selectedSeason.id} onChange={selectedSeasonChange}>
            {seasonsData?.allSeasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </VStack>
        <AgeGroupRoleSelector />
      </Stack>
      <Stack my={2} direction={['column', 'column', 'row']} justify="space-between" gap={2}>
        <Checkbox colorScheme="brand" isChecked={nationalOnly} onChange={nationalOnlyChange}>
          Csak országos és kiemelt rangsoroló versenyek
        </Checkbox>
        {window.innerWidth < 768 ? <CriteriaDrawer isMobile /> : <CriteriaDrawer isMobile={false} />}
      </Stack>

      {resultsLoading ? <LoadingSpinner /> : <EventResultTable />}
    </>
  )
}

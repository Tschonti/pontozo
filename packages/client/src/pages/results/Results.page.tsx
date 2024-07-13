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
  Heading,
  HStack,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, RatingRole } from '@pontozo/common'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useFetchEventResultsMutation, useFetchSeasonsMutation } from 'src/api/hooks/resultHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { translateAgeGroup, translateRole } from 'src/util/enumHelpers'
import { PATHS } from 'src/util/paths'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { EventResultTable } from './components/EventResultTable'

export const ResultsPage = () => {
  const resultsMutation = useFetchEventResultsMutation()
  const seasonsMutation = useFetchSeasonsMutation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<number>()
  const [selectedRole, setSelectedRole] = useState<RatingRole | 'ALL'>('ALL')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'ALL'>('ALL')
  const [nationalOnly, setNationalOnly] = useState(false)

  useEffect(() => {
    seasonsMutation.mutate(undefined)
    resultsMutation.mutate({ categoryIds: [], criterionIds: [], nationalOnly: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
  }

  const categoryCheckChange = (event: ChangeEvent, categoryId: number) => {
    if ((event.target as HTMLInputElement).checked) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    } else {
      setSelectedCategoryIds(selectedCategoryIds.filter((cId) => cId !== categoryId))
    }
  }

  const criterionCheckChange = (event: ChangeEvent, criterrionId: number) => {
    if ((event.target as HTMLInputElement).checked) {
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
    })
  }

  const saveSelectedIds = () => {
    sendResultRequest()
    onClose()
  }

  const selectedSeasonChange = (event: ChangeEvent) => {
    setSelectedSeasonId(parseInt((event.target as HTMLInputElement).value))
    seasonsMutation.mutate(parseInt((event.target as HTMLInputElement).value))
  }

  const selectedAgeGroupChange = (event: ChangeEvent) => {
    setSelectedRole('ALL')
    setSelectedAgeGroup(((event.target as HTMLInputElement).value as AgeGroup) || undefined)
  }
  const selectedRoleChange = (event: ChangeEvent) => {
    setSelectedAgeGroup('ALL')
    setSelectedRole(((event.target as HTMLInputElement).value as RatingRole) || undefined)
  }

  const nationalOnlyChange = (event: ChangeEvent) => {
    setNationalOnly(!nationalOnly)
    sendResultRequest((event.target as HTMLInputElement).checked)
  }

  return (
    <>
      <HelmetTitle title="Pontoz-O" />
      <Heading my={5}>Értékelt versenyek</Heading>
      <HStack gap={2}>
        <Select value={selectedSeasonId ?? seasonsMutation.data?.selectedSeason.id} onChange={selectedSeasonChange}>
          {seasonsMutation.data?.allSeasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select value={selectedAgeGroup} onChange={selectedAgeGroupChange}>
          <option value="ALL">Mind</option>
          {ALL_AGE_GROUPS.map((ag) => (
            <option key={ag} value={ag}>
              {translateAgeGroup[ag]}
            </option>
          ))}
        </Select>
        <Select value={selectedRole} onChange={selectedRoleChange}>
          <option value="ALL">Mind</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {translateRole[r]}
            </option>
          ))}
        </Select>
      </HStack>
      <HStack my={2} justify="space-between">
        <Checkbox colorScheme="brand" isChecked={nationalOnly} onChange={nationalOnlyChange}>
          Csak országos és kiemelt rangsoroló versenyek
        </Checkbox>
        <Button colorScheme="brand" onClick={onOpen}>
          Szempontok ({selectedCategoryIds.length + selectedCriterionIds.length})
        </Button>
      </HStack>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Megjelenített szempontok</DrawerHeader>

          <DrawerBody>
            <VStack alignItems="flex-start" gap={1}>
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
            <Button colorScheme="gray" mr={3} onClick={onClose}>
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
        <EventResultTable
          results={resultsMutation.data}
          role={selectedRole === 'ALL' ? undefined : selectedRole}
          ageGroup={selectedAgeGroup === 'ALL' ? undefined : selectedAgeGroup}
        />
      )}
    </>
  )
}

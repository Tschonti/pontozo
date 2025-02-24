import { AgeGroup, ALL_AGE_GROUPS, ALL_ROLES, EventResult, RatingRole } from '@pontozo/common'
import { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { ResultTableState } from 'src/pages/results/types/ResultTableState'
import { LocalStorageKeys } from 'src/util/localStorageKeys'
import { PATHS } from 'src/util/paths'
import { sortEvents } from 'src/util/resultItemHelpers'
import { useFetchEventResultsMutation, useFetchSeasonsMutation } from '../hooks/resultHooks'
import { CriterionId, ResultTableContext, SortOrder } from './ResultTableContext'

type Props = {
  minimal?: boolean
} & PropsWithChildren

export const ResultTableProvider = ({ children, minimal = false }: Props) => {
  const resultsMutation = useFetchEventResultsMutation()
  const seasonsMutation = useFetchSeasonsMutation()

  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<number>()
  const [selectedRoles, setSelectedRoles] = useState<RatingRole[]>(ALL_ROLES)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>(ALL_AGE_GROUPS)
  const [nationalOnly, setNationalOnly] = useState(false)
  const [includeTotal, setIncludeTotal] = useState(true)
  const [sortCriterion, setSortCriterion] = useState<CriterionId | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [sortedEvents, setSortedEvents] = useState<EventResult[]>([])

  useEffect(() => {
    if (minimal) return
    const saved = localStorage.getItem(LocalStorageKeys.FILTER_LS_KEY)
    if (!saved) {
      seasonsMutation.mutate(undefined)
      resultsMutation.mutate({ categoryIds: [], criterionIds: [], nationalOnly: false, includeTotal: true })
    } else {
      const filterData: ResultTableState = JSON.parse(saved)
      seasonsMutation.mutate(filterData.seasonId)
      resultsMutation.mutate({
        seasonId: filterData.seasonId,
        categoryIds: filterData.categoryIds,
        criterionIds: filterData.criterionIds,
        nationalOnly: filterData.nationalOnly,
        includeTotal: filterData.includeTotal,
      })
      setSelectedSeasonId(filterData.seasonId)
      setSelectedCategoryIds(filterData.categoryIds)
      setSelectedCriterionIds(filterData.criterionIds)
      setNationalOnly(filterData.nationalOnly)
      setIncludeTotal(filterData.includeTotal)
      setSelectedAgeGroups(filterData.ageGroups)
      setSelectedRoles(filterData.roles)
      setSortCriterion(filterData.sortId)
      setSortOrder(filterData.sortOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!resultsMutation.data?.eventResults || minimal) return
    if (!sortCriterion) {
      setSortedEvents(resultsMutation.data.eventResults)
    } else if (sortCriterion === 'total') {
      setSortedEvents(
        sortEvents(resultsMutation.data.eventResults, sortOrder, (r) => !r.categoryId && !r.criterionId, selectedRoles, selectedAgeGroups)
      )
    } else {
      const [type, id] = sortCriterion.split('-')
      setSortedEvents(
        sortEvents(
          resultsMutation.data.eventResults,
          sortOrder,
          (r) => (type === 'crit' ? r.criterionId === parseInt(id) : r.categoryId === parseInt(id)),
          selectedRoles,
          selectedAgeGroups
        )
      )
    }
  }, [sortOrder, sortCriterion, resultsMutation.data?.eventResults, selectedAgeGroups, selectedRoles, minimal])

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
  }

  const saveToLocalStorage = (newValues: Partial<ResultTableState>) => {
    if (minimal) return
    localStorage.setItem(
      LocalStorageKeys.FILTER_LS_KEY,
      JSON.stringify({
        seasonId: newValues.seasonId ?? seasonsMutation.data?.selectedSeason.id,
        categoryIds: newValues.categoryIds ?? selectedCategoryIds,
        criterionIds: newValues.criterionIds ?? selectedCriterionIds,
        nationalOnly: newValues.nationalOnly ?? nationalOnly,
        includeTotal: newValues.includeTotal ?? includeTotal,
        ageGroups: newValues.ageGroups ?? selectedAgeGroups,
        roles: newValues.roles ?? selectedRoles,
        sortId: newValues.sortId ?? sortCriterion,
        sortOrder: newValues.sortOrder ?? sortOrder,
      })
    )
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
    saveToLocalStorage({ seasonId: newSeasonId, categoryIds: [], criterionIds: [], includeTotal: true })

    seasonsMutation.mutate(newSeasonId)
    resultsMutation.mutate({
      seasonId: newSeasonId,
      categoryIds: [],
      criterionIds: [],
      nationalOnly: nationalOnly,
      includeTotal: true,
    })
  }

  const sortByCrit = (id: CriterionId | undefined) => {
    if (sortCriterion === id && id) {
      const newOrder = sortOrder === 'desc' ? 'asc' : 'desc'
      setSortOrder(newOrder)
      saveToLocalStorage({ sortOrder: newOrder })
    } else {
      setSortCriterion(id)
      setSortOrder('desc')
      saveToLocalStorage({ sortOrder: 'desc', sortId: id })
    }
  }

  return (
    <ResultTableContext.Provider
      value={{
        selectedCriterionIds,
        selectedCategoryIds,
        selectedSeasonId,
        selectedRoles,
        selectedAgeGroups,
        nationalOnly,
        includeTotal,
        sortCriterion,
        sortOrder,
        filtersApplied: selectedRoles.length < ALL_ROLES.length || selectedAgeGroups.length < ALL_AGE_GROUPS.length,
        setSelectedCriterionIds,
        setSelectedCategoryIds,
        setSelectedRoles,
        setSelectedAgeGroups,
        setNationalOnly,
        setIncludeTotal,
        seasonsData: seasonsMutation.data,
        resultsData: resultsMutation.data,
        resultsLoading: resultsMutation.isLoading,
        sortedEvents,
        selectedSeasonChange,
        sendResultRequest,
        sortByCrit,
        saveToLocalStorage,
      }}
    >
      {children}
    </ResultTableContext.Provider>
  )
}

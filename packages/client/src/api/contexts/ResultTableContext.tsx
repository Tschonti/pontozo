import { AgeGroup, AllSeasonsAndOne, ALL_AGE_GROUPS, ALL_ROLES, EventResult, EventResultList, RatingRole } from '@pontozo/common'
import { ChangeEvent, createContext, PropsWithChildren, useEffect, useState } from 'react'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { EventFilter } from 'src/pages/results/types/EventFilter'
import { PATHS } from 'src/util/paths'
import { sortEvents } from 'src/util/resultItemHelpers'
import { useFetchEventResultsMutation, useFetchSeasonsMutation } from '../hooks/resultHooks'

export type CriterionId = 'total' | `crit-${string}` | `cat-${string}`
export type SortOrder = 'desc' | 'asc'

export type ResultTableContextType = {
  selectedSeasonId?: number
  selectedCategoryIds: number[]
  selectedCriterionIds: number[]
  includeTotal: boolean
  nationalOnly: boolean
  selectedAgeGroups: AgeGroup[]
  selectedRoles: RatingRole[]
  sortCriterion?: CriterionId
  sortOrder: SortOrder

  setSelectedCategoryIds: (newValue: number[]) => void
  setSelectedCriterionIds: (newValue: number[]) => void
  setIncludeTotal: (newValue: boolean) => void
  setNationalOnly: (newValue: boolean) => void
  setSelectedAgeGroups: (newValue: AgeGroup[]) => void
  setSelectedRoles: (newValue: RatingRole[]) => void

  seasonsData?: AllSeasonsAndOne
  resultsData?: EventResultList
  resultsLoading: boolean
  sortedEvents: EventResult[]

  selectedSeasonChange: (event: ChangeEvent) => void
  sendResultRequest: (national?: boolean) => void
  sortByCrit: (id: CriterionId | undefined) => void
}

export const ResultTableContext = createContext<ResultTableContextType>({
  selectedSeasonId: undefined,
  selectedCategoryIds: [],
  selectedCriterionIds: [],
  includeTotal: true,
  nationalOnly: false,
  selectedAgeGroups: [],
  selectedRoles: [],
  sortCriterion: undefined,
  sortOrder: 'desc',

  setSelectedCategoryIds: () => { },
  setSelectedCriterionIds: () => { },
  setIncludeTotal: () => { },
  setNationalOnly: () => { },
  setSelectedAgeGroups: () => { },
  setSelectedRoles: () => { },

  resultsLoading: true,
  sortedEvents: [],

  selectedSeasonChange: () => { },
  sendResultRequest: () => { },
  sortByCrit: () => { },
})

const FILTER_LS_KEY = 'FILTER_LS_KEY'

export const ResultTableProvider = ({ children }: PropsWithChildren) => {
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

  useEffect(() => {
    if (!resultsMutation.data?.eventResults) return
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
  }, [sortOrder, sortCriterion, resultsMutation.data?.eventResults, selectedAgeGroups, selectedRoles])

  if (resultsMutation.error || seasonsMutation.error) {
    console.error(resultsMutation.error)
    console.error(seasonsMutation.error)
    return <NavigateWithError to={PATHS.ERROR} error={resultsMutation.error ?? seasonsMutation.error!} />
  }

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

  const sortByCrit = (id: CriterionId | undefined) => {
    if (sortCriterion === id && id) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortCriterion(id)
      setSortOrder('desc')
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
      }}
    >
      {children}
    </ResultTableContext.Provider>
  )
}

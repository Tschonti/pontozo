import { AgeGroup, AllSeasonsAndOne, EventResult, EventResultList, RatingRole } from '@pontozo/common'
import { ChangeEvent, createContext } from 'react'
import { ResultTableState } from 'src/pages/results/types/ResultTableState'

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
  filtersApplied: boolean

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
  saveToLocalStorage: (newValues: Partial<ResultTableState>) => void
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
  filtersApplied: false,

  setSelectedCategoryIds: () => {},
  setSelectedCriterionIds: () => {},
  setIncludeTotal: () => {},
  setNationalOnly: () => {},
  setSelectedAgeGroups: () => {},
  setSelectedRoles: () => {},

  resultsLoading: true,
  sortedEvents: [],

  selectedSeasonChange: () => {},
  sendResultRequest: () => {},
  sortByCrit: () => {},
  saveToLocalStorage: () => {},
})

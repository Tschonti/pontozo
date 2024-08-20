import { AgeGroup, RatingRole } from '@pontozo/common'
import { CriterionId, SortOrder } from 'src/api/contexts/ResultTableContext'
import { EventFilter } from './EventFilter'

export type ResultTableState = EventFilter & {
  ageGroups: AgeGroup[]
  roles: RatingRole[]
  sortId?: CriterionId
  sortOrder: SortOrder
}

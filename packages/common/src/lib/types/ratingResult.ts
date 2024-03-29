import { Category } from './categories'
import { Criterion } from './criteria'
import { DbEvent, DbStage } from './dbEvents'

export interface RatingResult {
  id: number
  parentId?: number
  eventId: number
  stageId?: number
  criterionId?: number
  criterion?: Criterion
  categoryId?: number
  category?: Category
  items: RatingResultItem[]
}

export interface RatingResultItem {
  count: number
  average: number
  role?: string
  ageGroup?: string
}

export interface EventWithResults extends Omit<DbEvent, 'stages'> {
  ratingResults: RatingResult
  stages: (DbStage & {
    ratingResults: RatingResult
  })[]
}

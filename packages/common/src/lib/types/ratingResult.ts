import { Category } from './categories'
import { Criterion } from './criteria'
import { DbEvent, DbStage } from './dbEvents'
import { Season } from './seasons'

export interface RatingResult {
  id: number
  parentId?: number
  eventId: number
  stageId?: number
  criterionId?: number
  categoryId?: number
  items: RatingResultItem[]
}

export interface RatingResultWithJoins extends RatingResult {
  criterion?: Criterion
  category?: Category
  children?: RatingResultWithJoins[]
}

export interface RatingResultItem {
  count: number
  average: number
  role?: string
  ageGroup?: string
}

export interface StageWithResults extends DbStage {
  ratingResults: RatingResultWithJoins
}

export interface EventWithResults extends Omit<DbEvent, 'stages'> {
  ratingResults: RatingResultWithJoins
  stages: StageWithResults[]
}

export interface EventResultList {
  season: Season
  categories: Category[]
  criteria: Criterion[]
  eventResults: EventResult[]
}

export interface EventResult {
  eventId: number
  eventName: string
  startDate: string
  results: RatingResult[]
  stages: StageResult[]
}

export interface StageResult {
  stageId: number
  stageName: string
  results: RatingResult[]
}

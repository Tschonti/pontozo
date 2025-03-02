import { Category } from './categories'
import { Criterion } from './criteria'
import { DbEvent, DbStage } from './dbEvents'
import { RatingRole } from './eventRatings'
import { Season } from './seasons'
import { AgeGroup } from './users'

export interface RatingResult {
  id: number
  parentId?: number
  eventId: number
  stageId?: number
  criterionId?: number
  categoryId?: number
  items?: RatingResultItem[]
  score: number
  competitorWeight?: number
  organiserWeight?: number
}

export interface RatingResultWithChildren extends RatingResult {
  children?: RatingResultWithChildren[]
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
  ratingResults?: RatingResultWithJoins
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
  results: RatingResultWithChildren[]
  stages: StageResult[]
}

export interface PublicEventMessage {
  eventRatingId: number
  message: string
  role: RatingRole
  ageGroup: AgeGroup
}

export interface EventMessages {
  messages: PublicEventMessage[]
}

export interface StageResult {
  stageId: number
  stageName: string
  results: RatingResultWithChildren[]
}

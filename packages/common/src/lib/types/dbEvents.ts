import { EventRating } from './eventRatings'

export interface DbEvent {
  id: number
  name: string
  type: string
  startDate: string
  endDate?: string
  state: EventState
  highestRank: Rank
  seasonId: number
  organisers: Club[]
  stages?: DbStage[]
  scoresCalculatedAt?: Date
  totalRatingCount: number
}

export enum EventState {
  RATEABLE = 'RATEABLE',
  VALIDATING = 'VALIDATING',
  ACCUMULATING = 'ACCUMULATING',
  RESULTS_READY = 'RESULTS_READY',
  INVALIDATED = 'INVALIDATED',
}

export interface EventWithRating {
  event: DbEvent
  userRating?:
    | (EventRating & {
        stages: DbStage[]
      })
    | null
}

export enum Rank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT',
}

export interface Club {
  id: number
  code: string
  shortName: string
  longName: string
}

export interface DbStage {
  id: number
  eventId: number
  startTime: string
  endTime?: string
  name: string
  disciplineId: number
  rank: string
}

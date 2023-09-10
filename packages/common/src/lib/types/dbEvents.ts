import { EventRating } from './eventRatings'

export interface DbEvent {
  id: number
  name: string
  type: string
  startDate: string
  endDate?: string
  rateable: boolean
  highestRank: Rank
  seasonId: number
  organisers: Club[]
  stages?: DbStage[]
}

export interface EventWithRating {
  event: DbEvent
  userRating?: EventRating & {
    stages: DbStage[]
  }
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

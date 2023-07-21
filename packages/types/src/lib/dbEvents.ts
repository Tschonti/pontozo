import { EventRating } from "./eventRatings"

export type DbEvent = {
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
  userRating?: EventRating
}

export enum Rank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT'
}

export type Club = {
  id: number
  code: string
  shortName: string
  longName: string
}

export type DbStage = {
  id: number
  eventId: number
  startTime: string
  endTime?: string
  name: string
  disciplineId: number
  rank: string
}

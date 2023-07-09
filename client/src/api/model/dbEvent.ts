export type DbEvent = {
  id: number
  name: string
  type: string
  startDate: string
  endDate?: string
  rateable: boolean
  highestRank: Rank
  organisers: Club[]
  stages?: DbStage[]
}

export enum Rank {
  REGIONAL = 'REGIONALIS',
  NATIONAL = 'ORSZAGOS',
  FEATURED = 'KIEMELT'
}

export type DbStage = {
  id: number
  event?: Event
  eventId: number
  startTime: string
  endTime?: string
  name: string
  disciplineId: number
  rank: Rank
}

export type Club = {
  id: number
  code: string
  shortName: string
  longName: string
}

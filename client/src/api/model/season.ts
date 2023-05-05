import { Category } from './category'

export interface Season {
  id: number
  name: string
  startDate: string
  endDate: string
}

export interface SeasonDetails extends Season {
  categories: Category[]
}

export interface CreateSeason extends Omit<Season, 'id'> {
  categoryIds: number[]
}

export interface CreateSeasonForm extends Omit<SeasonDetails, 'id'> {}

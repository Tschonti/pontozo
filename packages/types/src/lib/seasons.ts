import { ArrayUnique, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator'
import { IsLaterThan } from './customValidators'
import { Category } from './categories'

export type Season = {
  id: number
  name: string
  startDate: Date
  endDate: Date
}

export class CreateSeason {
  @IsNotEmpty()
  name: string

  @IsDateString()
  startDate: Date

  @IsDateString()
  @IsLaterThan('startDate', { message: 'endDate must be later than startDate!' })
  endDate: Date

  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  categoryIds: number[]
}

export interface SeasonWithCategories extends Season {
  categories: Category[]
}

export interface CreateSeasonForm extends Omit<SeasonWithCategories, 'id' | 'startDate' | 'endDate'> {
  startDate: string
  endDate: string
}

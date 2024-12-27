import { ArrayUnique, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator'
import { IsLaterThan } from '../util/customValidators'
import { Category, CategoryWithCriteria } from './categories'
import { CriterionWithWeight } from './criteria'

export interface Season {
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

export interface SeasonWithEverything extends Season {
  categories: CategoryWithCriteria[]
}

export interface CreateSeasonForm extends Omit<SeasonWithCategories, 'id' | 'startDate' | 'endDate'> {
  startDate: string
  endDate: string
}

export interface AllSeasonsAndOne {
  selectedSeason: SeasonWithEverything
  allSeasons: Season[]
}

export interface SeasonWithCriterionWeights extends Season {
  categories: CategoryWithCriteria<CriterionWithWeight>[]
}

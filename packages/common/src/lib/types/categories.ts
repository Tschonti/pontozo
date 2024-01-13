import { ArrayUnique, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
import { Criterion } from './criteria'
import { Season } from './seasons'

export interface Category {
  id: number
  name: string
  description: string
}

export class CreateCategory {
  @IsNotEmpty()
  name: string

  @IsString()
  description: string

  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  criterionIds: number[]
}

export type CreateCategoryForm = Omit<CategoryWithCriteria, 'id'>

export interface CategoryWithCriteria extends Category {
  criteria: Criterion[]
}

export interface CategoryWithSeasons extends Category {
  seasons: Season[]
}

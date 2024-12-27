import { ArrayNotEmpty, ArrayUnique, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'
import { CriterionRating } from './criterionRatings'
import { RatingRole } from './eventRatings'
import { Season } from './seasons'

export interface Criterion {
  id: number
  name: string
  description: string
  text0?: string
  text1?: string
  text2?: string
  text3?: string
  editorsNote?: string
  nationalOnly: boolean
  stageSpecific: boolean
  allowEmpty: boolean
  roles: RatingRole[]
}

export interface CriterionWeight {
  id: number
  criterionId: number
  seasonId: number
  competitorWeight?: number
  organiserWeight?: number
}

export interface CriterionWithSeason extends Criterion {
  seasons: Season[]
}

export interface CriterionWithWeight extends Criterion {
  weight?: CriterionWeight
}

export interface CriterionDetails extends Criterion {
  rating?: CriterionRating
}

export interface CreateCriterionForm extends Omit<Criterion, 'id' | 'roles'> {
  competitorAllowed: boolean
  juryAllowed: boolean
}

export class CreateCriteria {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsOptional()
  text0?: string

  @IsOptional()
  text1?: string

  @IsOptional()
  text2?: string

  @IsOptional()
  text3?: string

  @IsOptional()
  editorsNote?: string

  @IsBoolean()
  nationalOnly: boolean

  @IsBoolean()
  stageSpecific: boolean

  @IsBoolean()
  allowEmpty: boolean

  @IsEnum(RatingRole, { each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: RatingRole[]
}

export class CreateCriterionWeight {
  @IsNumber()
  @Min(0)
  competitorWeight: number

  @IsNumber()
  @Min(0)
  organiserWeight: number
}

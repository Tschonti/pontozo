import { ArrayNotEmpty, ArrayUnique, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { RatingRole } from '../../../typeorm/entities/EventRating'

export class CreateCriteriaDTO {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsOptional()
  text0: string

  @IsOptional()
  text1: string

  @IsOptional()
  text2: string

  @IsOptional()
  text3: string

  @IsOptional()
  editorsNote: string

  @IsBoolean()
  nationalOnly: boolean

  @IsBoolean()
  stageSpecific: boolean

  @IsBoolean()
  allowEmpty: boolean

  @IsOptional()
  @IsInt()
  competitorWeight: number

  @IsOptional()
  @IsInt()
  organiserWeight: number

  @IsEnum(RatingRole, { each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: RatingRole[]
}

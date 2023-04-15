import { ArrayNotEmpty, ArrayUnique, IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator'
import { RatingRole } from '../../../typeorm/entities/RatinRole'
import { IsBiggerThan } from '../../../util/validation'

export class CreateCriteriaDTO {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  description: string

  @IsInt()
  @Min(0)
  minValue: number

  @IsInt()
  @IsBiggerThan('minValue', {
    message: 'maxValue must be bigger than minValue!'
  })
  maxValue: number

  @IsInt()
  weight: number

  @IsEnum(RatingRole, { each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: RatingRole[]
}

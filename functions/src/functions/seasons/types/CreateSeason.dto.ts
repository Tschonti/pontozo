import { ArrayUnique, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator'
import { IsLaterThan } from '../../../util/validation'

export class CreateSeasonDTO {
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

import { ArrayUnique, IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator'

export class CreateSeasonDTO {
  @IsNotEmpty()
  name: string

  @IsDateString()
  startDate: Date
  @IsDateString()
  endDate: Date

  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  categoryIds: number[]
}

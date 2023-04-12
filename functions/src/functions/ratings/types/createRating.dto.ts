import { IsInt, Min } from 'class-validator'

export class CreateRatingDto {
  @IsInt()
  @Min(0)
  value: number

  @IsInt()
  @Min(1)
  criterionId: number
}

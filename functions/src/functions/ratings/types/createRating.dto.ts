import { IsInt, Max, Min } from 'class-validator'

export class CreateRatingDto {
  @IsInt()
  @Min(0)
  @Max(3)
  value: number

  @IsInt()
  @Min(1)
  criterionId: number
}

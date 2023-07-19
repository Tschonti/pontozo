import { ArrayUnique, IsInt, IsOptional, Min } from 'class-validator'

export class GetCriterionRatings {
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  criterionIds: number[]

  @IsOptional()
  @IsInt()
  @Min(1)
  stageId?: number
}

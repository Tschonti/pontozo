import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator'

class OneCriterionRating {
  @IsInt()
  @Min(0)
  @Max(3)
  value: number

  @IsInt()
  @Min(1)
  criterionId: number
}

export class CreateManyRatingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  stageId?: number

  @ValidateNested({ each: true })
  @Type(() => OneCriterionRating)
  ratings: OneCriterionRating[]
}

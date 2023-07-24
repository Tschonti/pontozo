import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { MtfszStage } from './mtfszEvents'

export type CriterionRating = {
  id: number
  criterionId: number
  eventRatingId: number
  stageId?: number
  stage?: MtfszStage
  value: number
}

export class CreateCriterionRating {
  @IsInt()
  @Min(-1)
  @Max(3)
  value: number

  @IsInt()
  @Min(1)
  criterionId: number

  @IsOptional()
  @IsInt()
  @Min(1)
  stageId?: number
}

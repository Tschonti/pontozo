import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { DbStage } from './dbEvents'

export interface CriterionRating {
  id: number
  criterionId: number
  eventRatingId: number
  stageId?: number
  stage?: DbStage
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

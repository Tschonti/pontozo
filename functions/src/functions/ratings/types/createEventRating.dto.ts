import { IsEnum, IsInt, Min } from 'class-validator'
import { RatingRole } from '../../../typeorm/entities/RatinRole'

export class CreateEventRatingDto {
  @IsInt()
  @Min(1)
  eventId: number

  @IsEnum(RatingRole)
  role: RatingRole
}

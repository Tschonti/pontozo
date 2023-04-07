import { RatingRole } from "../../../lib/typeorm/entities/RatinRole"


export class CreateCriteriaDTO {
  name: string
  description: string
  minValue: number
  maxValue: number
  weight: number
  roles: RatingRole[]
}

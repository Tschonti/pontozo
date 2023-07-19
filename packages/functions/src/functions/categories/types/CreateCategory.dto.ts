import { ArrayUnique, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class CreateCategoryDTO {
  @IsNotEmpty()
  name: string

  @IsString()
  description: string

  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  criterionIds: number[]
}

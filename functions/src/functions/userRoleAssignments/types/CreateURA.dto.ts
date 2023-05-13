import { IsEnum, IsInt, Min } from 'class-validator'
import { UserRole } from '../../../typeorm/entities/UserRoleAssignment'

export class CreateURADTO {
  @IsInt()
  @Min(1)
  userId: number

  @IsEnum(UserRole)
  role: UserRole
}

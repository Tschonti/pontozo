import { IsEnum } from 'class-validator'
import { UserRole } from '../../../typeorm/entities/UserRoleAssignment'

export class UpdateURADTO {
  @IsEnum(UserRole)
  role: UserRole
}

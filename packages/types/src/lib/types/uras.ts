import { IsEnum, IsInt, Min } from 'class-validator'

export enum UserRole {
  SITE_ADMIN = 'SITE_ADMIN',
  JURY = 'JURY',
  COACH = 'COACH',
}

export interface UserRoleAssignment {
  id: number
  userId: number
  role: UserRole
  userFullName: string
  userDOB: string
}

export class CreateURA {
  @IsInt()
  @Min(1)
  userId: number

  @IsEnum(UserRole)
  role: UserRole
}

export class UpdateURA {
  @IsEnum(UserRole)
  role: UserRole
}

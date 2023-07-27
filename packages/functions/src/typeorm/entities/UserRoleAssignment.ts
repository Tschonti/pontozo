import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { UserRoleAssignment as IUserRoleAssignment } from '@pontozo/common'

enum UserRole {
  SITE_ADMIN = 'SITE_ADMIN',
  JURY = 'JURY',
  COACH = 'COACH',
}

@Entity()
@Unique(['userId', 'role'])
class UserRoleAssignment implements IUserRoleAssignment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  @Check("role in('SITE_ADMIN', 'COACH', 'JURY')")
  role: UserRole

  @Column()
  userFullName: string

  @Column()
  userDOB: string
}

export default UserRoleAssignment

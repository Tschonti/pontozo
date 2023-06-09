import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

export enum UserRole {
  SITE_ADMIN = 'SITE_ADMIN',
  JURY = 'JURY',
  COACH = 'COACH'
}

@Entity()
@Unique(['userId', 'role'])
class UserRoleAssignment {
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

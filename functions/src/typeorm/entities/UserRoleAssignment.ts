import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRole {
  SITE_ADMIN = 'SITE_ADMIN',
  JURY = 'JURY',
  COACH = 'COACH'
}

@Entity()
class UserRoleAssignment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  @Check("role in('SITE_ADMIN', 'COACH', 'JURY')")
  role: UserRole
}

export default UserRoleAssignment

import { UserRole } from '../../../typeorm/entities/UserRoleAssignment'
import { MtfszUser } from './MtfszUser'

export interface PontozoUser extends MtfszUser {
  roles: UserRole[]
}

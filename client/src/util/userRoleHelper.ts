import { UserRole } from '../api/model/user'

type UserRoleDictionary = {
  [K in UserRole]: string
}

export const translateUR: UserRoleDictionary = {
  [UserRole.COACH]: 'Edző',
  [UserRole.SITE_ADMIN]: 'Admin',
  [UserRole.JURY]: 'MTFSZ Zsűri'
}

export const urColor: UserRoleDictionary = {
  [UserRole.COACH]: 'green',
  [UserRole.SITE_ADMIN]: 'purple',
  [UserRole.JURY]: 'orange'
}

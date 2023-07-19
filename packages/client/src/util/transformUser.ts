import { User, UserPreview } from '../api/model/user'

export const transformUser = (u: User): UserPreview => ({
  userDOB: u.szul_dat,
  userFullName: u.vezeteknev + ' ' + u.keresztnev,
  userId: u.szemely_id
})

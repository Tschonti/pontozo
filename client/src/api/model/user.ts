export interface User {
  felhasznalo_id: number
  szemely_id: number
  keresztnev: string
  vezeteknev: string
  nev: string
  email: string
  nem: string
  titulus: string
  szul_dat: string
  username: string
  v_nytsz: string
}

export interface UserDetails extends User {
  roles: UserRole[]
}

export interface UserPreview {
  userId: number
  userFullName: string
  userDOB: string
}

export enum UserRole {
  SITE_ADMIN = 'SITE_ADMIN',
  JURY = 'JURY',
  COACH = 'COACH'
}

export interface UserRoleAssignment extends UserPreview {
  id: number
  role: UserRole
}

export interface CreateUra {
  userId: number
  role: UserRole
}

export interface UpdateUra extends Omit<CreateUra, 'userId'> {}

import { UserRole } from './uras'

export interface MtfszUser {
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

export interface DbUser extends MtfszUser {
  roles: UserRole[]
}

export interface UserPreview {
  userId: number
  userFullName: string
  userDOB: string
}

export interface MtfszToken {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

import { UserRole } from './uras'

export interface RawMtfszUser {
  szemely_id: number
  titulus: string
  vezeteknev: string
  keresztnev: string
  szul_dat: string
  halalozas_dat: string
  nem: string
  allampolgarsag: number
  created_at: string
  updated_at: string
  v_nytsz: string
  v_si: number
  v_is_active: boolean
  v_created_at: string
  v_updated_at: string
  szemely_szervezetek: UserOrg[]
  versenyengedelyek: License[]
}

export interface UserOrg {
  szemely_szervezet_id: number
  datum_tol: string
  datum_ig: string
  is_deleted: boolean
  szervezet_id: number
}

export interface License {
  ve_id: number
  datum_tol: string
  datum_ig: string
  is_deleted: boolean
}

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

export enum AgeGroup {
  YOUTH = 'YOUTH',
  ELITE = 'ELITE',
  MASTER = 'MASTER',
}

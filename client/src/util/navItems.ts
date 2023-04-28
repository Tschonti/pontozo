import { PATHS } from './paths'

export interface INavItem {
  label: string
  path: string
}

export const navItems: INavItem[] = [
  { label: 'Versenyek', path: PATHS.INDEX },
  { label: 'Admin', path: PATHS.CRITERIA }
]

export const adminNavItems: INavItem[] = [
  { label: 'Értékelések', path: PATHS.INDEX },
  { label: 'Szempontok', path: PATHS.CRITERIA },
  { label: 'Kategóriák', path: PATHS.CATEGORIES },
  { label: 'Szezonok', path: PATHS.SEASONS },
  { label: 'Felhasználók', path: PATHS.USERS }
]

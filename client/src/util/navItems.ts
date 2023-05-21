import { PATHS } from './paths'

export interface INavItem {
  label: string
  path: string
  shown: (loggedIn: boolean, admin: boolean) => boolean
}

export const navItems: INavItem[] = [
  { label: 'VERSENYEK', path: PATHS.INDEX, shown: () => true },
  { label: 'ADMIN', path: PATHS.ADMIN, shown: (l, a) => l && a },
  { label: 'PROFIL', path: PATHS.PROFILE, shown: (l) => l }
]

export const adminNavItems: INavItem[] = [
  { label: 'TUDNIVALÓK', path: PATHS.ADMIN, shown: (l, a) => l && a },
  { label: 'ÉRTÉKELÉSEK', path: PATHS.INDEX, shown: (l, a) => l && a },
  { label: 'SZEMPONTOK', path: PATHS.CRITERIA, shown: (l, a) => l && a },
  { label: 'KATEGÓRIÁK', path: PATHS.CATEGORIES, shown: (l, a) => l && a },
  { label: 'SZEZONOK', path: PATHS.SEASONS, shown: (l, a) => l && a },
  { label: 'FELHASZNÁLÓK', path: PATHS.USERS, shown: (l, a) => l && a }
]

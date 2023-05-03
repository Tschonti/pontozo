import { PATHS } from './paths'

export interface INavItem {
  label: string
  path: string
  shown: (loggedIn: boolean, admin: boolean) => boolean
}

export const navItems: INavItem[] = [
  { label: 'Versenyek', path: PATHS.INDEX, shown: () => true },
  { label: 'Admin', path: PATHS.ADMIN, shown: (l, a) => l && a },
  { label: 'Profil', path: PATHS.PROFILE, shown: (l) => l }
]

export const adminNavItems: INavItem[] = [
  { label: 'Tudnivalók', path: PATHS.ADMIN, shown: (l, a) => l && a },
  { label: 'Értékelések', path: PATHS.INDEX, shown: (l, a) => l && a },
  { label: 'Szempontok', path: PATHS.CRITERIA, shown: (l, a) => l && a },
  { label: 'Kategóriák', path: PATHS.CATEGORIES, shown: (l, a) => l && a },
  { label: 'Szezonok', path: PATHS.SEASONS, shown: (l, a) => l && a },
  { label: 'Felhasználók', path: PATHS.USERS, shown: (l, a) => l && a }
]

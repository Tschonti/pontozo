import { PATHS } from './paths'

export interface INavItem {
  label: string
  path: string
}

export const navItems: INavItem[] = [
  { label: 'Versenyek', path: PATHS.INDEX },
  { label: 'Admin', path: PATHS.CRITERIA }
]

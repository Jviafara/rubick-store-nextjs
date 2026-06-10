import { IconType } from 'react-icons/lib'

export type GenericObject = Record<string, unknown>

export interface userMenuProps {
  open: boolean
  toggleMenu: () => void
}

export interface IMenuConfig {
  display: string
  path: string
  icon: IconType
  state: string
}

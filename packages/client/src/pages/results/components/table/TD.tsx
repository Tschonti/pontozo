import { PropsWithChildren } from 'react'

type Props = {
  centered?: boolean
} & PropsWithChildren

export const TD = ({ children, centered = false }: Props) => (
  <td style={{ textAlign: centered ? 'center' : 'start', border: '1px lightgray solid' }}>{children}</td>
)

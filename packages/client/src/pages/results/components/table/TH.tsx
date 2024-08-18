import { PropsWithChildren } from 'react'

type Props = {
  centered?: boolean
} & PropsWithChildren

export const TH = ({ children, centered = false }: Props) => (
  <th
    style={{
      padding: '0.5rem',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.025em',
      color: '#4A5568',
      textAlign: centered ? 'center' : 'start',
      border: '1px lightgray solid',
    }}
  >
    {children}
  </th>
)

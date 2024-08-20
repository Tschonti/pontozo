import { PropsWithChildren } from 'react'

type Props = {
  centered?: boolean
  onClick?: () => void
} & PropsWithChildren

export const TH = ({ children, centered = false, onClick }: Props) => (
  <th
    style={{
      cursor: 'pointer',
      padding: '0.5rem',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.025em',
      color: '#4A5568',
      textAlign: centered ? 'center' : 'start',
      border: '1px lightgray solid',
    }}
    onClick={onClick}
  >
    {children}
  </th>
)

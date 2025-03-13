import { ReactNode, useState } from 'react'
import { HashLink } from 'react-router-hash-link'

type Props = {
  to: string
  children: ReactNode
}

export const ColorfulHashLink = ({ children, to }: Props) => {
  const [hovered, setHovered] = useState(false)
  return (
    <HashLink
      to={to}
      style={{ color: '#0a723a', textDecoration: hovered ? 'underline' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </HashLink>
  )
}

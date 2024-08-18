import { PropsWithChildren } from 'react'

type Props = {
  index: number
} & PropsWithChildren

export const TR = ({ index, children }: Props) => (
  <tr
    style={{
      padding: '2rem',
      backgroundColor: index % 2 === 0 ? '#ffffff52' : '#c0ddc052',
    }}
  >
    {children}
  </tr>
)

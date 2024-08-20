import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from 'src/util/paths'

type Props = {
  index: number
  eventId: number
  hovered: boolean
  setHoverEventId: (eId: number | undefined) => void
} & PropsWithChildren

export const TR = ({ index, children, eventId, hovered, setHoverEventId }: Props) => {
  const nav = useNavigate()
  return (
    <tr
      onMouseEnter={() => setHoverEventId(eventId)}
      onMouseLeave={() => setHoverEventId(undefined)}
      onClick={() => nav(`${PATHS.RESULTS}/${eventId}`)}
      style={{
        padding: '2rem',
        backgroundColor: index % 2 === 0 ? (hovered ? '#ececec78' : '#ffffff52') : hovered ? '#7fd77f52' : '#b1e2b152',
        cursor: 'pointer',
      }}
    >
      {children}
    </tr>
  )
}

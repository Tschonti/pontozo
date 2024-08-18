import { useParams } from 'react-router-dom'

export const ResultDetailsPage = () => {
  const { eventId } = useParams()
  return 'Rating results ' + eventId
}

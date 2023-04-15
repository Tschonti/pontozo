import { Heading, Spinner } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useFetchRatingQuery } from '../../api/hooks/ratingHooks'
import { CriterionRateForm } from './components/CriterionRateForm'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { data, isLoading, error } = useFetchRatingQuery(+ratingId!!)

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <>
      <Heading>{data?.event.nev_1} értékelése</Heading>
      {data?.criteria.map((c) => (
        <CriterionRateForm criterion={c} eventRatingId={+ratingId!!} key={c.id} />
      ))}
    </>
  )
}

import { useRateCriteriaMutation } from '../../../api/hooks/criteriaMutationHook'
import { Criterion } from '../../../api/model/criterion'

type Props = {
  criterion: Criterion
  eventRatingId: number
}

export const CriterionRateForm = ({ criterion, eventRatingId }: Props) => {
  const mutation = useRateCriteriaMutation(eventRatingId, criterion.id)

  return null
}

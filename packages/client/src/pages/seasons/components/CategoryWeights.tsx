import { Text } from '@chakra-ui/react'
import { CategoryWithCriteria, CriterionWithWeight } from '@pontozo/common'
import { CriterionWeights } from './CriterionWeights'

type Props = {
  category: CategoryWithCriteria<CriterionWithWeight>
  seasonId: string
}

export const CategoryWeights = ({ category, seasonId }: Props) => {
  return (
    <>
      <Text gridColumn="1/4">
        <b>{category.name}</b>
      </Text>
      {category.criteria.map((cc) => (
        <CriterionWeights key={cc.id} criterion={cc} seasonId={seasonId} />
      ))}
    </>
  )
}

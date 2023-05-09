import { Heading, Text, VStack } from '@chakra-ui/react'
import { CategoryWithCriteria } from '../../../api/model/category'
import { CriterionRateForm } from './CriterionRateForm'

type Props = {
  category: CategoryWithCriteria
  ratingId: number
}

export const CategoryWithCriteriaList = ({ category, ratingId }: Props) => {
  return (
    <VStack my={5} alignItems="flex-start">
      <Heading size="sm">{category.name}</Heading>
      <Text>{category.description}</Text>
      {category.criteria.map((criteria) => (
        <CriterionRateForm criterion={criteria} eventRatingId={ratingId} key={criteria.id} />
      ))}
    </VStack>
  )
}

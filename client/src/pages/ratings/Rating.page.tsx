import { Button, Heading, HStack } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { eventRatingInfo, infoLoading, nextCategory, previousCategory, currentStage, hasNext, hasPrev, stageIdx } = useRatingContext()

  if (infoLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Heading mb={2}>{currentStage ? currentStage.name || `${stageIdx + 1}. futam` : eventRatingInfo?.eventName} értékelése</Heading>
      {currentStage ? (
        <Heading size="sm">
          A futamra vonatkozó szempontok szerint (futam {stageIdx + 1}/{eventRatingInfo?.stages.length})
        </Heading>
      ) : (
        <Heading size="sm">A teljes versenyre vonatkozó szempontok szerint</Heading>
      )}
      <CategoryWithCriteriaList ratingId={+ratingId!!} />
      <HStack mt={3} justify="space-between" w="100%">
        <Button leftIcon={<FaArrowLeft />} onClick={() => previousCategory()}>
          {hasPrev ? 'Előző' : 'Vissza a versenyhez'}
        </Button>
        <Button rightIcon={<FaArrowRight />} colorScheme="brand" onClick={() => nextCategory()}>
          {hasNext ? 'Következő' : 'Véglegesítés'}
        </Button>
      </HStack>
    </>
  )
}

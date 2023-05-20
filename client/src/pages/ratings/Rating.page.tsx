import { Button, Heading, HStack, Spinner } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { eventRatingInfo, infoLoading, nextCategory, previousCategory, currentStage, hasNext, hasPrev, stageIdx } = useRatingContext()

  if (infoLoading) {
    return <Spinner />
  }

  return (
    <>
      <Heading mb={2}>{currentStage ? currentStage.nev_1 || `${stageIdx + 1}. futam` : eventRatingInfo?.eventName} értékelése</Heading>
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
        <Button rightIcon={<FaArrowRight />} colorScheme="green" onClick={() => nextCategory()}>
          {hasNext ? 'Következő' : 'Véglegesítés'}
        </Button>
      </HStack>
    </>
  )
}

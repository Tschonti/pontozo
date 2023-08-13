import { Button, Heading, HStack } from '@chakra-ui/react'
import { createPortal } from 'react-dom'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'
import { RatingProgressBar } from './components/RatingProgressBar'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { eventRatingInfo, infoLoading, nextCategory, previousCategory, currentStage, hasNext, hasPrev, stageIdx } = useRatingContext()

  if (infoLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {createPortal(<RatingProgressBar />, document.getElementById('ratingPB')!)}
      <Heading mb={2}>{eventRatingInfo?.eventName} értékelése</Heading>
      {currentStage && <Heading size="md">Futam: {currentStage.name || `${stageIdx + 1}. futam`}</Heading>}
      <CategoryWithCriteriaList ratingId={+ratingId!} />
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

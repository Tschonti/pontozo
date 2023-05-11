import { Button, Heading, HStack, Spinner } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const [searchParams] = useSearchParams()
  const { eventRatingInfo, infoLoading, nextCategory, previousCategory, currentCategory, currentStage, categoryIdx, stageIdx } =
    useRatingContext()
  const nav = useNavigate()

  if (infoLoading) {
    return <Spinner />
  }

  if (!currentCategory) {
    //console.error(error)
    return null
  }

  return (
    <>
      <Heading>{currentStage ? currentStage.nev_1 : eventRatingInfo?.eventName} értékelése</Heading>
      {currentStage ? (
        <Heading size="sm">
          A futamra vonatkozó szempontok szerint (futam {stageIdx + 1}/{eventRatingInfo?.stages.length})
        </Heading>
      ) : (
        <Heading size="sm">A teljes versenyre vonatkozó szempontok szerint</Heading>
      )}
      <CategoryWithCriteriaList ratingId={+ratingId!!} />

      <HStack justify="space-between" w="100%">
        <Button leftIcon={<FaArrowLeft />} onClick={() => previousCategory()}>
          Vissza
        </Button>
        <Button rightIcon={<FaArrowRight />} colorScheme="green" onClick={() => nextCategory()}>
          Tovább
        </Button>
      </HStack>
    </>
  )
}

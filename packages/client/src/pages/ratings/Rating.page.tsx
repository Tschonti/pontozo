import { Button, HStack } from '@chakra-ui/react'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'
import { RatingProgressBar } from './components/RatingProgressBar'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { infoLoading, nextCategory, previousCategory, hasNext, hasPrev } = useRatingContext()

  if (infoLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {createPortal(<RatingProgressBar />, document.getElementById('ratingPB')!)}
      <CategoryWithCriteriaList ratingId={+ratingId!} />
      <HStack mt={3} justify="space-between" w="100%">
        <Button leftIcon={<FaChevronLeft />} onClick={() => previousCategory()}>
          {hasPrev ? 'Előző' : 'Vissza a versenyhez'}
        </Button>
        <Button rightIcon={<FaChevronRight />} colorScheme="brand" onClick={() => nextCategory()}>
          {hasNext ? 'Következő' : 'Véglegesítés'}
        </Button>
      </HStack>
    </>
  )
}

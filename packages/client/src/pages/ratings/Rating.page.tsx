import { Button, HStack, useMediaQuery } from '@chakra-ui/react'
import { RatingStatus } from '@pontozo/common'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useAuthContext } from 'src/api/contexts/useAuthContext'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoginNavigate } from 'src/components/commons/LoginNavigate'
import { useRatingContext } from '../../api/contexts/useRatingContext'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { CategoryWithCriteriaList } from './components/CategoryWithCriteriaList'
import { DesktopRatingProgressBar } from './components/DesktopRatingProgressBar'
import { MobileRatingProgressBar } from './components/MobileRatingProgressBar'
import { SubmitRatingModal } from './components/SubmitRatingModal'

export const RatingPage = () => {
  const { ratingId } = useParams()
  const { isLoggedIn } = useAuthContext()
  const { infoLoading, nextCategory, previousCategory, hasNext, hasPrev, eventRatingInfo, currentStage } = useRatingContext()
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  if (!isLoggedIn) {
    return <LoginNavigate />
  }

  if (infoLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <HelmetTitle title={`Pontoz-O | ${eventRatingInfo?.eventName}, ${currentStage?.name ?? 'teljes verseny'} érétékelése`} />
      {createPortal(isDesktop ? <DesktopRatingProgressBar /> : <MobileRatingProgressBar />, document.getElementById('ratingPB')!)}
      <CategoryWithCriteriaList ratingId={+ratingId!} />
      <HStack mt={3} justify="space-between" w="100%">
        <Button leftIcon={<FaChevronLeft />} onClick={() => previousCategory()}>
          {hasPrev ? 'Előző' : 'Vissza a versenyhez'}
        </Button>
        {eventRatingInfo?.status === RatingStatus.STARTED && !hasNext && <SubmitRatingModal colorScheme="brand" />}
        {hasNext && (
          <Button rightIcon={<FaChevronRight />} colorScheme="brand" onClick={() => nextCategory()}>
            Következő
          </Button>
        )}
      </HStack>
    </>
  )
}

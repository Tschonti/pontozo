import { Box, Button, Grid, Heading, HStack, Stack, useMediaQuery } from '@chakra-ui/react'
import { RatingStatus } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { PContainer } from 'src/components/commons/PContainer'
import { formatDateRange } from 'src/util/formatDateRange'
import { PATHS } from 'src/util/paths'
import './progressBar.css'
import { ProgressBarItem } from './ProgressBarItem'
import { SubmitRatingModal } from './SubmitRatingModal'

export const DesktopRatingProgressBar = () => {
  const { eventRatingInfo, nextCategory, previousCategory, hasNext, hasPrev } = useRatingContext()
  const [isLargeScreen] = useMediaQuery('(min-width: 1200px)')

  const [sticky, setSticky] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= document.getElementById('ratingPB')!.offsetTop) {
        setSticky(true)
        document.getElementById('content')?.classList.add('belowSticky')
      } else {
        setSticky(false)
        document.getElementById('content')?.classList.remove('belowSticky')
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.getElementById('content')?.classList.remove('belowSticky')
    }
  }, [])

  if (!eventRatingInfo) return null
  const categoryCount = eventRatingInfo.eventCategories.length + eventRatingInfo.stages.length * eventRatingInfo.stageCategories.length
  const eventWidth = (eventRatingInfo.eventCategories.length / categoryCount) * 100
  return (
    <Box w="100%" className={sticky ? 'sticky' : undefined} zIndex={10}>
      <Box bgColor={sticky ? 'brand.500' : 'white'} color={sticky ? 'white' : undefined}>
        <PContainer>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            alignItems={{ base: 'flex-start', lg: 'center' }}
            w="100%"
            justify="space-between"
          >
            <Heading title="Vissza a versenyhez" as={Link} to={`${PATHS.EVENTS}/${eventRatingInfo.eventId}`} size={'md'}>
              {eventRatingInfo.eventName} értékelése
            </Heading>
            <Heading size="sm">{formatDateRange(eventRatingInfo.startDate, eventRatingInfo.endDate)}</Heading>
          </Stack>
        </PContainer>
      </Box>

      <Grid
        templateColumns={`${eventWidth}% repeat(${eventRatingInfo.stages.length}, 1fr)`}
        py={0}
        my={0}
        mx={0}
        px={0}
        w="100%"
        bgColor="white"
      >
        <ProgressBarItem itemStageIdx={-1} name={'Teljes verseny'} />
        {eventRatingInfo.stages.map((s, idx) => (
          <ProgressBarItem key={s.id} itemStageIdx={idx} name={s.name} />
        ))}
      </Grid>
      {isLargeScreen && (
        <HStack pos="absolute" px={2} pt={2} w="100%" justify="space-between">
          <Button color="brand.500" leftIcon={<FaChevronLeft />} onClick={() => previousCategory()} variant="ghost">
            {hasPrev ? 'Előző' : 'Vissza'}
          </Button>
          {eventRatingInfo?.status === RatingStatus.STARTED && !hasNext && <SubmitRatingModal variant="ghost" color="brand.500" />}
          {hasNext && (
            <Button rightIcon={<FaChevronRight />} onClick={() => nextCategory()} variant="ghost">
              Következő
            </Button>
          )}
        </HStack>
      )}
    </Box>
  )
}

import { Box, Heading, Progress, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { PContainer } from 'src/components/commons/PContainer'
import { PATHS } from 'src/util/paths'
import './progressBar.css'

export const MobileRatingProgressBar = () => {
  const { eventRatingInfo, categoryIdx, stageIdx, currentStage } = useRatingContext()

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
  let categoriesCompleted = categoryIdx + 1
  if (stageIdx > -1) {
    categoriesCompleted += eventRatingInfo.eventCategories.length + stageIdx * eventRatingInfo.stageCategories.length
  }

  return (
    <Box w="100%" className={sticky ? 'sticky' : undefined} zIndex={10}>
      <Box bgColor={sticky ? 'brand.500' : 'white'} color={sticky ? 'white' : undefined}>
        <PContainer>
          <Heading title="Vissza a versenyhez" as={Link} to={`${PATHS.EVENTS}/${eventRatingInfo.eventId}`} size={sticky ? 'md' : 'lg'}>
            {eventRatingInfo.eventName} értékelése
          </Heading>
        </PContainer>
      </Box>

      <VStack w="100%" spacing={0} bgColor="white">
        <Text py={2} fontWeight="bold" transform="auto" skewX={-15}>
          {currentStage?.name || 'Teljes verseny'}
        </Text>
        <Progress
          sx={{
            '& > div:first-of-type': {
              transitionProperty: 'width',
            },
          }}
          w="100%"
          value={(categoriesCompleted / categoryCount) * 100}
          size="xs"
          colorScheme="brand"
        />
      </VStack>
    </Box>
  )
}

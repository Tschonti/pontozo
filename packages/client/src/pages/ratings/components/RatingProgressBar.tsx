import { Grid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import './progressBar.css'
import { ProgressBarItem } from './ProgressBarItem'

export const RatingProgressBar = () => {
  const { eventRatingInfo } = useRatingContext()

  const [sticky, setSticky] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= document.getElementById('ratingPB')!.offsetTop) {
        setSticky(true)
        document.getElementById('content')?.classList.add('belowSticky')
      } else {
        setSticky(false)
        document.getElementById('content')?.classList.remove('belowSticky')
      }
    })
  }, [])

  if (!eventRatingInfo) return null
  const categoryCount = eventRatingInfo.eventCategories.length + eventRatingInfo.stages.length * eventRatingInfo.stageCategories.length
  const eventWidth = (eventRatingInfo.eventCategories.length / categoryCount) * 100
  return (
    <Grid
      className={sticky ? 'sticky' : undefined}
      templateColumns={`${eventWidth}% repeat(${eventRatingInfo.stages.length}, 1fr)`}
      py={0}
      my={0}
      mx={0}
      px={0}
      w="100%"
      bgColor="white"
      zIndex={10}
    >
      <ProgressBarItem itemStageIdx={-1} name={'Teljes verseny'} />
      {eventRatingInfo.stages.map((s, idx) => (
        <ProgressBarItem key={s.id} itemStageIdx={idx} name={s.name} />
      ))}
    </Grid>
  )
}

import { Progress, Text, VStack } from '@chakra-ui/react'
import { useRatingContext } from 'src/api/contexts/useRatingContext'

type Props = {
  itemStageIdx: number
  name: string
}

export const ProgressBarItem = ({ itemStageIdx, name }: Props) => {
  const { categoryIdx, eventRatingInfo, stageIdx } = useRatingContext()
  const currentStage = itemStageIdx === stageIdx
  const completedStage = itemStageIdx < stageIdx
  const categoryArray = itemStageIdx === -1 ? eventRatingInfo?.eventCategories : eventRatingInfo?.stageCategories
  let percent = completedStage ? 1 : 0
  if (currentStage) {
    percent = (categoryIdx + 1) / (categoryArray?.length || 1)
  }
  return (
    <VStack display="flex" justify="flex-end" w="100%" spacing={0} borderRightWidth={3} borderRightColor="white">
      <Text textAlign="center" transform="auto" skewX={currentStage ? -15 : 0} py={2} fontWeight={currentStage ? 'bold' : undefined}>
        {name}
      </Text>
      <Progress
        sx={{
          '& > div:first-of-type': {
            transitionProperty: 'width',
          },
        }}
        w="100%"
        value={percent * 100}
        size="xs"
        colorScheme="brand"
      />
    </VStack>
  )
}

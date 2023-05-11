import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { functionAxios } from '../../util/initAxios'
import { PATHS } from '../../util/paths'
import { CategoryWithCriteria } from '../model/category'
import { EventSectionPreview } from '../model/event'
import { EventRatingInfo } from '../model/rating'

export type RatingContextType = {
  eventRatingInfo: EventRatingInfo | undefined
  infoLoading: boolean
  currentStage: EventSectionPreview | undefined
  currentCategory: CategoryWithCriteria | undefined
  categoryIdx: number
  stageIdx: number
  ratingId: number
  startRating: (ratingId: number) => void
  nextCategory: () => void
  previousCategory: () => void
}

export const RatingContext = createContext<RatingContextType>({
  eventRatingInfo: undefined,
  infoLoading: false,
  ratingId: -1,
  currentStage: undefined,
  currentCategory: undefined,
  categoryIdx: 0,
  stageIdx: -1,
  startRating: () => {},
  nextCategory: () => {},
  previousCategory: () => {}
})

export const RatingProvider = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [stage, setStage] = useState<EventSectionPreview>()
  const [category, setCategory] = useState<CategoryWithCriteria>()
  const [ratingId, setRatingId] = useState(-1)
  const [stageIdx, setStageIdx] = useState(-1)
  const [categoryIdx, setCategoryIdx] = useState(0)
  const navigate = useNavigate()
  const { data, isLoading } = useQuery(
    ['ratingInfo', ratingId],
    async () => (await functionAxios.get<EventRatingInfo>(`/ratings/${ratingId}/info`)).data,
    {
      enabled: ratingId > 0,
      retry: false,
      onSuccess: (data) => {
        console.log(data)
        if (categoryIdx >= 0) {
          setCategory(stageIdx > -1 ? data.stageCategories[categoryIdx] : data.eventCategories[categoryIdx])
        }
        if (stageIdx >= 0) {
          setStage(data.stages[stageIdx])
        }
      }
    }
  )

  useEffect(() => {
    const splitPath = pathname.split('/')
    if (
      splitPath.length === 3 &&
      splitPath[1] === 'ratings' &&
      !isNaN(parseInt(splitPath[2])) &&
      !isNaN(parseInt(searchParams.get('categoryIdx') || ''))
    ) {
      setRatingId(parseInt(splitPath[2]))
      setCategoryIdx(parseInt(searchParams.get('categoryIdx') || ''))
      if (!isNaN(parseInt(searchParams.get('stageIdx') || ''))) {
        setStageIdx(parseInt(searchParams.get('stageIdx') || ''))
      }
    } else {
      reset()
    }
  }, [pathname, searchParams])

  const startRating = (ratingId: number) => {
    navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=0`)
  }

  const nextCategory = () => {
    if (!data) {
      return
    }
    if (stage) {
      if (categoryIdx < data.stageCategories.length - 1) {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx}&categoryIdx=${categoryIdx + 1}`)
        setCategory(data.stageCategories[categoryIdx + 1])
        setCategoryIdx(categoryIdx + 1)
      } else {
        if (stageIdx < data.stages.length - 1) {
          navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx + 1}&categoryIdx=${0}`)
          setCategoryIdx(0)
          setCategory(data.stageCategories[0])
          setStage(data.stages[stageIdx + 1])
          setStageIdx(stageIdx + 1)
        } else {
          submitRating()
          reset()
        }
      }
    } else {
      if (categoryIdx < data.eventCategories.length - 1) {
        navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${categoryIdx + 1}`)
        setCategory(data.eventCategories[categoryIdx + 1])
        setCategoryIdx(categoryIdx + 1)
      } else {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=0&categoryIdx=0`)
        setCategoryIdx(0)
        setCategory(data.stageCategories[0])
        setStage(data.stages[0])
        setStageIdx(0)
      }
    }
  }

  const previousCategory = () => {
    if (!data) {
      return
    }
    if (stage) {
      if (categoryIdx > 0) {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageId=${stageIdx}&categoryIdx=${categoryIdx - 1}`)
        setCategory(data.stageCategories[categoryIdx - 1])
        setCategoryIdx(categoryIdx - 1)
      } else {
        if (stageIdx > 0) {
          navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx - 1}&categoryIdx=${data.stageCategories.length - 1}`)
          setCategory(data.stageCategories[data.stageCategories.length - 1])
          setCategoryIdx(data.stageCategories.length - 1)
          setStage(data.stages[stageIdx - 1])
          setStageIdx(stageIdx - 1)
        } else {
          navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${data.eventCategories.length - 1}`)
          setCategory(data.eventCategories[data.eventCategories.length - 1])
          setCategoryIdx(data.eventCategories.length - 1)
          setStage(undefined)
          setStageIdx(-1)
        }
      }
    } else {
      if (categoryIdx > 0) {
        navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${categoryIdx - 1}`)
        setCategory(data.eventCategories[categoryIdx - 1])
        setCategoryIdx(categoryIdx - 1)
      } else {
        navigate(`${PATHS.EVENTS}/${data.eventId}`)
        reset()
      }
    }
  }

  const submitRating = () => {
    // TODO
    console.log('submit')
  }

  const reset = () => {
    setRatingId(-1)
    setStage(undefined)
    setStageIdx(-1)
    setCategory(undefined)
    setCategoryIdx(0)
  }

  return (
    <RatingContext.Provider
      value={{
        eventRatingInfo: data,
        infoLoading: isLoading,
        currentStage: stage,
        currentCategory: category,
        categoryIdx,
        stageIdx,
        ratingId,
        startRating,
        nextCategory,
        previousCategory
      }}
    >
      {children}
    </RatingContext.Provider>
  )
}

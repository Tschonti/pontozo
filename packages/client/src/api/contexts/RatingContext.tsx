import { useToast } from '@chakra-ui/react'
import { CategoryWithCriteria, DbStage, EventRatingInfo } from '@pontozo/common'
import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { onError } from 'src/util/onError'
import { scrollToPB } from 'src/util/scrollToPB'
import { functionAxios } from '../../util/axiosConfig'
import { PATHS } from '../../util/paths'
import { useSubmitRatingMutation } from '../hooks/ratingHooks'

export type RatingContextType = {
  eventRatingInfo: EventRatingInfo | undefined
  infoLoading: boolean
  currentStage: DbStage | undefined
  currentCategory: CategoryWithCriteria | undefined
  categoryIdx: number
  stageIdx: number
  ratingId: number
  hasPrev: boolean
  hasNext: boolean
  validate: boolean
  startRating: (ratingId: number) => void
  rateCriterion: (criterionId: number) => void
  removeCriterionRating: (criterionId: number) => void
  rateCriteria: (criterionId: number[]) => void
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
  hasPrev: false,
  hasNext: true,
  validate: false,
  startRating: () => {},
  rateCriterion: () => {},
  removeCriterionRating: () => {},
  rateCriteria: () => {},
  nextCategory: () => {},
  previousCategory: () => {},
})

export const RatingProvider = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [stage, setStage] = useState<DbStage>()
  const [category, setCategory] = useState<CategoryWithCriteria>()
  const [ratingId, setRatingId] = useState(-1)
  const [stageIdx, setStageIdx] = useState(-1)
  const [validate, setValidate] = useState(false)
  const [categoryIdx, setCategoryIdx] = useState(0)
  const [ratedCriteria, setRatedCriteria] = useState<string[]>([])
  const navigate = useNavigate()
  const toast = useToast()

  const generateCriterionId = (cId: number) => {
    return `${stage ? stage.id : 0}-${cId}`
  }

  const { data, isLoading } = useQuery(
    ['ratingInfo', ratingId],
    async () => (await functionAxios.get<EventRatingInfo>(`/ratings/${ratingId}/info`)).data,
    {
      enabled: ratingId > 0,
      retry: false,
      onSuccess: (data) => {
        if (categoryIdx >= 0) {
          setCategory(stageIdx > -1 ? data.stageCategories[categoryIdx] : data.eventCategories[categoryIdx])
        }
        if (stageIdx >= 0) {
          setStage(data.stages[stageIdx])
        }
      },
    }
  )
  const submitMutation = useSubmitRatingMutation()

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

  const rateCriterion = (criterionId: number) => {
    if (!ratedCriteria.includes(generateCriterionId(criterionId))) {
      setRatedCriteria([...ratedCriteria, generateCriterionId(criterionId)])
    }
  }

  const removeCriterionRating = (criterionId: number) => {
    if (ratedCriteria.includes(generateCriterionId(criterionId))) {
      setRatedCriteria(ratedCriteria.filter((c) => c === generateCriterionId(criterionId)))
    }
  }

  const rateCriteria = (criterionIds: number[]) => {
    const newArray = [...ratedCriteria]
    criterionIds.forEach((cId) => {
      if (!ratedCriteria.includes(generateCriterionId(cId))) {
        newArray.push(generateCriterionId(cId))
      }
    })
    setRatedCriteria(newArray)
  }

  const nextCategory = () => {
    if (!data) {
      return
    }
    if (category?.criteria.some((c) => !ratedCriteria.includes(generateCriterionId(c.id)))) {
      setValidate(true)
      toast({ title: 'Minden szempont kitöltése kötelező!', status: 'warning' })
      return
    }
    scrollToPB()
    setValidate(false)
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
    scrollToPB()
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
    submitMutation.mutate(ratingId, {
      onSuccess: () => {
        reset()
        toast({ title: 'Értékelés véglegesítve!', status: 'success' })
        navigate(`${PATHS.EVENTS}/${data?.eventId}`)
      },
      onError: (e) => onError(e, toast),
    })
  }

  const reset = () => {
    setRatingId(-1)
    setStage(undefined)
    setStageIdx(-1)
    setCategory(undefined)
    setCategoryIdx(0)
    setRatedCriteria([])
    setValidate(false)
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
        hasPrev: !!stage || categoryIdx > 0,
        hasNext: !stage || !data || categoryIdx < data?.stageCategories.length - 1 || stageIdx < data.stages.length - 1,
        validate,
        startRating,
        rateCriteria,
        removeCriterionRating,
        rateCriterion,
        nextCategory,
        previousCategory,
      }}
    >
      {children}
    </RatingContext.Provider>
  )
}

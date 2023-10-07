import { useToast } from '@chakra-ui/react'
import { CategoryWithCriteria, DbStage } from '@pontozo/common'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { onError } from 'src/util/onError'
import { PATHS } from 'src/util/paths'
import { scrollToPB } from 'src/util/scrollToPB'
import { useFetchRatingInfo, useSubmitRatingMutation, useTurnPageMutation } from '../hooks/ratingHooks'
import { RatingContext } from './RatingContext'

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

  const { data, isLoading } = useFetchRatingInfo((data) => {
    if (categoryIdx >= 0) {
      const categriesArray = stageIdx > -1 ? data.stageCategories : data.eventCategories
      if (categoryIdx >= categriesArray.length || stageIdx >= data.stages.length) {
        setCategoryIdx(0)
        setStage(undefined)
        setStageIdx(-1)
        setCategory(categriesArray[0])
        navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${0}`)
        return
      }
      setCategory(categriesArray[categoryIdx])
      if (stageIdx >= 0) {
        setStage(data.stages[stageIdx])
      }
    }
  }, ratingId)

  const submitMutation = useSubmitRatingMutation()
  const turnPageMutation = useTurnPageMutation()

  useEffect(() => {
    const splitPath = pathname.split('/')
    if (
      splitPath.length === 3 &&
      splitPath[1] === 'ratings' &&
      !isNaN(parseInt(splitPath[2])) &&
      !isNaN(parseInt(searchParams.get('categoryIdx') ?? ''))
    ) {
      setRatingId(parseInt(splitPath[2]))
      setCategoryIdx(parseInt(searchParams.get('categoryIdx') ?? ''))
      if (!isNaN(parseInt(searchParams.get('stageIdx') ?? ''))) {
        setStageIdx(parseInt(searchParams.get('stageIdx') ?? ''))
      }
    } else {
      reset()
    }
  }, [pathname, searchParams])

  useEffect(() => {
    scrollToPB()
  }, [category])

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
    setValidate(false)
    let newCategory = category
    let newCategoryIdx = categoryIdx
    let newStage = stage
    let newStageIdx = stageIdx
    if (stage) {
      if (categoryIdx < data.stageCategories.length - 1) {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx}&categoryIdx=${categoryIdx + 1}`)
        newCategory = data.stageCategories[categoryIdx + 1]
        newCategoryIdx = categoryIdx + 1
      } else {
        if (stageIdx < data.stages.length - 1) {
          navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx + 1}&categoryIdx=${0}`)
          newCategoryIdx = 0
          newCategory = data.stageCategories[0]
          newStage = data.stages[stageIdx + 1]
          newStageIdx = stageIdx + 1
        } else {
          submitRating()
        }
      }
    } else {
      if (categoryIdx < data.eventCategories.length - 1) {
        navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${categoryIdx + 1}`)
        newCategory = data.eventCategories[categoryIdx + 1]
        newCategoryIdx = categoryIdx + 1
      } else {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=0&categoryIdx=0`)
        newCategoryIdx = 0
        newCategory = data.stageCategories[0]
        newStage = data.stages[0]
        newStageIdx = 0
      }
    }
    turnPageMutation.mutate({ ratingId, categoryIdx: newCategoryIdx, stageIdx: newStageIdx })
    setCategoryIdx(newCategoryIdx)
    setCategory(newCategory)
    setStageIdx(newStageIdx)
    setStage(newStage)
  }

  const previousCategory = () => {
    if (!data) {
      return
    }

    let newCategory = category
    let newCategoryIdx = categoryIdx
    let newStage = stage
    let newStageIdx = stageIdx
    if (stage) {
      if (categoryIdx > 0) {
        navigate(`${PATHS.RATINGS}/${ratingId}?stageId=${stageIdx}&categoryIdx=${categoryIdx - 1}`)
        newCategory = data.stageCategories[categoryIdx - 1]
        newCategoryIdx = categoryIdx - 1
      } else {
        if (stageIdx > 0) {
          navigate(`${PATHS.RATINGS}/${ratingId}?stageIdx=${stageIdx - 1}&categoryIdx=${data.stageCategories.length - 1}`)
          newCategory = data.stageCategories[data.stageCategories.length - 1]
          newCategoryIdx = data.stageCategories.length - 1
          newStage = data.stages[stageIdx - 1]
          newStageIdx = stageIdx - 1
        } else {
          navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${data.eventCategories.length - 1}`)
          newCategory = data.eventCategories[data.eventCategories.length - 1]
          newCategoryIdx = data.eventCategories.length - 1
          newStage = undefined
          newStageIdx = -1
        }
      }
    } else {
      if (categoryIdx > 0) {
        navigate(`${PATHS.RATINGS}/${ratingId}?categoryIdx=${categoryIdx - 1}`)
        newCategory = data.eventCategories[categoryIdx - 1]
        newCategoryIdx = categoryIdx - 1
      } else {
        navigate(`${PATHS.EVENTS}/${data.eventId}`)
        reset()
      }
    }

    turnPageMutation.mutate({ ratingId, categoryIdx: newCategoryIdx, stageIdx: newStageIdx })
    setCategoryIdx(newCategoryIdx)
    setCategory(newCategory)
    setStageIdx(newStageIdx)
    setStage(newStage)
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

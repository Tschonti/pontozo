import { Button, Heading, HStack, Spinner, useToast, VStack } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchStageRatingQuery, useSubmitRatingMutation } from '../../api/hooks/ratingHooks'
import { PATHS } from '../../util/paths'
import { CriterionRateForm } from './components/CriterionRateForm'

export const StageRatingPage = () => {
  const { ratingId, stageId } = useParams()
  const { data, isLoading, error } = useFetchStageRatingQuery(+ratingId!!, +stageId!!)
  const { mutate: submitRating } = useSubmitRatingMutation(+ratingId!!)
  const nav = useNavigate()
  const toast = useToast()

  const onSubmit = () => {
    submitRating(undefined, {
      onSuccess: () => {
        nav(`${PATHS.EVENTS}/${data?.eventId}`)
        toast({ title: 'Értékelés sikerese leadva!', status: 'success' })
      }
    })
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <>
      <Heading>{data?.stage.nev_1 || (data?.stageIdx || 0) + 1 + '. futam'} értékelése</Heading>
      <Heading size="sm">
        A futamra vonatkozó szempontok szerint (futam {(data?.stageIdx || 0) + 1}/{data?.stageCount || 1})
      </Heading>
      <VStack my={5}>
        {data?.stageCriteria.map((c) => (
          <CriterionRateForm criterion={c} eventRatingId={+ratingId!!} key={c.id} stageId={+stageId!!} />
        ))}
      </VStack>
      <HStack justify="space-between" w="100%">
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() =>
            nav(data?.prevStageId ? `${PATHS.RATINGS}/${ratingId}/stage/${data?.prevStageId}` : `${PATHS.RATINGS}/${ratingId}`)
          }
        >
          Vissza
        </Button>
        {data?.nextStageId ? (
          <Button
            rightIcon={<FaArrowRight />}
            colorScheme="green"
            onClick={() => nav(`${PATHS.RATINGS}/${ratingId}/stage/${data?.nextStageId}`)}
          >
            Tovább
          </Button>
        ) : (
          <Button colorScheme="green" onClick={onSubmit}>
            Mentés
          </Button>
        )}
      </HStack>
    </>
  )
}

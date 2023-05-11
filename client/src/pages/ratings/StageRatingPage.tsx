export const StageRatingPage = () => {
  /*
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
      {data?.categoriesWithCriteria.map((category) => (
        <CategoryWithCriteriaList category={category} ratingId={+ratingId!!} />
      ))}
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
  )*/
}

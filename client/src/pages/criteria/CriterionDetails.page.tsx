//import { useRateCriteriaMutation } from '../../api/hooks/criteriaMutationHook'

export const CriterionDetailsPage = () => {
  /*const { criterionId } = useParams()
  const { isLoading, error, data, refetch } = useFetchCriterion(+criterionId!!, (data) => setRating(data.minValue))
  //const rateMutation = useRateCriteriaMutation(+criterionId!!)
  const [rating, setRating] = useState(0)
  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    console.error(error)
    return null
  }*/
  return null /*(
    <>
      <Heading>{data?.name}</Heading>
      <Text>{data?.description}</Text>
      <Heading size="md">Értékelésed: {rating}</Heading>
      <Slider min={data?.minValue} max={data?.maxValue} value={rating} onChange={(e) => setRating(e)}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Button colorScheme="green" onClick={() => rateMutation.mutate(rating, { onSuccess: () => refetch() })}>
        Mentés
      </Button>
      <Heading size="md">Értékelések</Heading>
      {data?.ratings.map((r) => (
        <Box key={r.id}>
          <Text>{r.value}</Text>
        </Box>
      ))}
      <Button as={Link} to={PATHS.CRITERIA} leftIcon={<FaArrowLeft />}>
        Vissza
      </Button>
    </>
  )*/
}

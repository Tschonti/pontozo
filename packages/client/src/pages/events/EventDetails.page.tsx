import { Button, FormLabel, Heading, HStack, Select, Text, useCheckboxGroup, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { useStartRatingMutation } from 'src/api/hooks/ratingHooks'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { formatDateRange } from 'src/util/formatDateRange'
import { onError } from 'src/util/onError'
import { RatingRole, UserRole } from '../../../../common/src'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFetchEvent } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { GoToRatingButton } from './components/GoToRatingButton'
import { StageListItem } from './components/StageListItem'

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { data: eventWithRating, isLoading, error } = useFetchEvent(+eventId!)
  const { isLoggedIn, loggedInUser } = useAuthContext()
  const toast = useToast()
  const [role, setRole] = useState<RatingRole | undefined>()
  const [stageIds, setStageIds] = useState<number[]>([1])
  const startRating = useStartRatingMutation()
  const { startRating: startRatingWithContext } = useRatingContext()
  const { value, getCheckboxProps } = useCheckboxGroup()

  const onStartClick = () => {
    if (role) {
      startRating.mutate(
        { eventId: +eventId!, role, stageIdsToRate: stageIds },
        {
          onSuccess: (data) => startRatingWithContext(data.id),
          onError: (e) => onError(e, toast),
        }
      )
    }
  }
  useEffect(() => {
    console.log(value)
  }, [value])

  if (!isLoggedIn) {
    toast({ title: 'Jelentkezz be az oldal megtekintéséhez!', status: 'warning' })
    return <Navigate to={PATHS.INDEX} />
  }
  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error || !eventWithRating) {
    return <NavigateWithError error={error} to={PATHS.INDEX} />
  }
  const { event } = eventWithRating
  return (
    <VStack alignItems="flex-start" spacing={3}>
      <Heading>{event.name}</Heading>
      <Heading size="md">{formatDateRange(event.startDate, event.endDate)}</Heading>
      <Text>
        <b>Rendező{event.organisers.length > 1 && 'k'}:</b> {event.organisers.map((o) => o.shortName).join(', ')}
      </Text>
      <Text fontWeight="bold">Tudnivalók az értékelésről</Text>
      <Text textAlign="justify">
        Lórum ipse fűző szecskát tózik: a gubátos csillagos fagyans, iget bráni ez. Edre pedig azért egyetnek pátorban, hogy a letleni
        murgácsban kedő parás a becse spána és fenyére érdekében cinthetsen. Ponokba nőzködnek annak a meddő ható óvadélynak az elmelései,
        aki éppen a vazásról áttelepülve zuharozódta meg vétlen szapjas és virágyatos avánai fekényét. Bargadka szutya pálgálta
        tekevezékeire nemcsak nyögésről ebeckedt mong, hanem a taló taságoktól is. Csolás empőzs packávonálai újra meg újra ségetsék a
        fogást arra, hogy a haság és az olások elmenek amustól. A fetles ezer empőzs kasolta, hogy a szegséges ülöntés dikás karázsálnia az
        ehető haságot.
      </Text>
      <FormLabel mt={5}>Szerepköröd:</FormLabel>
      <Select placeholder="Válassz szerepkört!" value={role} onChange={(e) => setRole(e.target.value as RatingRole)}>
        <option value={RatingRole.COMPETITOR}>Versenyző</option>
        {loggedInUser?.roles.includes(UserRole.COACH) && <option value={RatingRole.COACH}>Edző</option>}
        <option value={RatingRole.ORGANISER}>Rendező</option>
        {loggedInUser?.roles.includes(UserRole.JURY) && <option value={RatingRole.JURY}>MTFSZ Zsűri</option>}
      </Select>
      <Heading size="md" my={3}>
        Futamok
      </Heading>
      {event.stages
        ?.sort((s1, s2) => parseInt(s1.startTime) - parseInt(s2.startTime))
        .map((s) => (
          <StageListItem stage={s} key={s.id} {...getCheckboxProps({ value: s.id })} />
        ))}
      <HStack w="100%" justify="space-between">
        <Button leftIcon={<FaArrowLeft />} as={Link} to={PATHS.INDEX}>
          Vissza
        </Button>
        <GoToRatingButton eventWithRating={eventWithRating} onStartClick={onStartClick} disabled={!role || !stageIds.length} />
      </HStack>
    </VStack>
  )
}

import { Button, Heading, HStack, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { EventState, RatingRole, ratingRoleArray } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaDatabase, FaMedal } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { useStartRatingMutation } from 'src/api/hooks/ratingHooks'
import { EventRatingStateBadge } from 'src/components/commons/EventRatingStateBadge'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoginNavigate } from 'src/components/commons/LoginNavigate'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { formatDateRange } from 'src/util/dateHelpers'
import { onError } from 'src/util/onError'
import { useAuthContext } from '../../api/contexts/useAuthContext'
import { useFetchEvent } from '../../api/hooks/eventQueryHooks'
import { LoadingSpinner } from '../../components/commons/LoadingSpinner'
import { PATHS } from '../../util/paths'
import { GoToRatingButton } from './components/GoToRatingButton'
import { RoleListItem } from './components/RoleListItem'
import { StageListItem } from './components/StageListItem'

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const nav = useNavigate()
  const dbQuery = useFetchEvent(+eventId!)
  const { isLoggedIn } = useAuthContext()
  const toast = useToast()
  const [role, setRole] = useState(RatingRole.COMPETITOR)
  const [stageIds, setStageIds] = useState<number[]>([])
  const startRating = useStartRatingMutation()
  const { startRating: startRatingWithContext } = useRatingContext()

  useEffect(() => {
    if (dbQuery.isFetchedAfterMount && dbQuery.data) {
      if (dbQuery.data.userRating) {
        setStageIds(dbQuery.data.userRating.stages.map((s) => s.id))
        setRole(dbQuery.data.userRating.role)
      } else {
        setStageIds(dbQuery.data.event?.stages?.map((s) => s.id) || [])
      }
    }
  }, [dbQuery.isFetchedAfterMount, dbQuery.data])

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

  const onItemChecked = (checked: boolean, stageId: number) => {
    if (checked && !stageIds.includes(stageId)) {
      setStageIds([...stageIds, stageId])
    } else {
      setStageIds(stageIds.filter((sId) => sId !== stageId))
    }
  }

  if (!isLoggedIn) {
    return <LoginNavigate />
  }

  if (dbQuery.isLoading) {
    return <LoadingSpinner />
  }
  if (dbQuery.error || !dbQuery.data) {
    return (
      <NavigateWithError
        error={dbQuery.error || { message: 'Nem sikerült betölteni a verseny adatait', statusCode: 500 }}
        to={PATHS.INDEX}
      />
    )
  }
  const { event, userRating } = dbQuery.data

  return (
    <VStack alignItems="flex-start" spacing={3}>
      <HelmetTitle title={`Pontoz-O | ${event.name}`} />
      <Heading>{event.name} értékelése</Heading>
      <HStack w="100%">
        <Heading size="md">{formatDateRange(event.startDate, event.endDate)}</Heading>
        <EventRatingStateBadge state={event.state} />
      </HStack>
      <Text>
        <b>Rendező{event.organisers.length > 1 && 'k'}:</b> {event.organisers.map((o) => o.shortName).join(', ')}
      </Text>
      <HStack flexWrap="wrap">
        {event.state === EventState.RESULTS_READY && (
          <Button onClick={() => nav(`${PATHS.RESULTS}/${eventId}`)} leftIcon={<FaMedal />} colorScheme="brand">
            Értékelés eredményei
          </Button>
        )}

        <Button
          leftIcon={<FaDatabase />}
          onClick={() => window.open(`http://adatbank.mtfsz.hu/esemeny/show/esemeny_id/${event.id}`, '_blank', 'noopener,noreferrer')}
          colorScheme="red"
          bg="mtfszRed"
        >
          MTFSZ Adatbank
        </Button>
      </HStack>
      <Heading size="md" mt={3}>
        Szerepkör
      </Heading>
      <Text>
        Válaszd ki, melyik szerepkörbe tartozol. A rajthozállás és rendezői tevékenység csak az értékelés lezárulása után kerül
        ellenőrzésre, aki nem megfelelő szerepkört választott, annak értékelése átsorololásra vagy törölésre kerül.
      </Text>
      {ratingRoleArray.map((r) => (
        <RoleListItem
          key={r}
          role={r}
          onSelected={() => setRole(r)}
          selected={role === r}
          disabled={!!userRating || event.state !== EventState.RATEABLE}
        />
      ))}
      <Heading size="md" mt={3}>
        Futamok
      </Heading>
      <Stack w="100%" direction={['column', 'column', 'row']} justify="space-between">
        <Text>Válaszd ki, mely futamokon álltál rajthoz.</Text>
        {stageIds.length === 0 && <Text color="red">Legalább egy futamot válassz ki!</Text>}
      </Stack>
      {event.stages
        ?.sort((s1, s2) => parseInt(s1.startTime) - parseInt(s2.startTime))
        .map((s) => (
          <StageListItem
            stage={s}
            key={s.id}
            disabled={!!userRating || event.state !== EventState.RATEABLE}
            onChecked={(c) => onItemChecked(c, s.id)}
            checked={stageIds.includes(s.id)}
          />
        ))}
      <HStack w="100%" justify="space-between">
        <Button leftIcon={<FaArrowLeft />} as={Link} to={PATHS.INDEX}>
          Vissza
        </Button>
        <GoToRatingButton
          isLoading={startRating.isLoading || dbQuery.isLoading}
          eventWithRating={dbQuery.data}
          onStartClick={onStartClick}
          startDisabled={!role || !stageIds.length}
          continueDisabled={event.state !== EventState.RATEABLE}
        />
      </HStack>
    </VStack>
  )
}

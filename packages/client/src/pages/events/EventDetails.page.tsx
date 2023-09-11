import { Button, Heading, HStack, Text, useToast, VStack } from '@chakra-ui/react'
import { EventRank, RatingRole, ratingRoleArray } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useRatingContext } from 'src/api/contexts/useRatingContext'
import { useStartRatingMutation } from 'src/api/hooks/ratingHooks'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { formatDateRange } from 'src/util/formatDateRange'
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
  const { data: eventWithRating, isLoading, error, isFetchedAfterMount } = useFetchEvent(+eventId!)
  const { isLoggedIn } = useAuthContext()
  const toast = useToast()
  const [role, setRole] = useState(RatingRole.COMPETITOR)
  const [stageIds, setStageIds] = useState<number[]>([])
  const startRating = useStartRatingMutation()
  const { startRating: startRatingWithContext } = useRatingContext()

  useEffect(() => {
    if (isFetchedAfterMount && eventWithRating) {
      if (eventWithRating.userRating) {
        setStageIds(eventWithRating.userRating.stages.map((s) => s.id))
        setRole(eventWithRating.userRating.role)
      } else {
        setStageIds(eventWithRating.event.stages?.filter((s) => s.rank !== EventRank.NONE).map((s) => s.id) ?? [])
      }
    }
  }, [isFetchedAfterMount, eventWithRating])

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
      <Heading size="md" mt={3}>
        Szerepkör
      </Heading>
      <Text>
        Válaszd ki, melyik szerepkörbe tartozol. Rajthozállást és rendezői tevékenységet csak az értékelés lezárulása után érétkeljük ki,
        aki nem megfelelő szerepkört választott, annak értékelését átsoroljuk vagy töröljük.
      </Text>
      {ratingRoleArray.map((r) => (
        <RoleListItem key={r} role={r} onSelected={() => setRole(r)} selected={role === r} disabled={!!eventWithRating.userRating} />
      ))}
      <Heading size="md" mt={3}>
        Futamok
      </Heading>
      <Text>Válaszd ki, mely futamokon álltál rajthoz.</Text>
      {event.stages
        ?.sort((s1, s2) => parseInt(s1.startTime) - parseInt(s2.startTime))
        .map((s) => (
          <StageListItem
            stage={s}
            key={s.id}
            disabled={!!eventWithRating.userRating}
            onChecked={(c) => onItemChecked(c, s.id)}
            checked={stageIds.includes(s.id)}
          />
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

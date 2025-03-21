import { Box, Button, FormLabel, Heading, HStack, Select, Stack, Text, VStack } from '@chakra-ui/react'
import { PublicEventMessage } from '@pontozo/common'
import { useEffect, useState } from 'react'
import { FaDatabase, FaStar } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { useFetchEventMessages, useFetchEventResults } from 'src/api/hooks/resultHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { formatDate, formatDateRange } from 'src/util/dateHelpers'
import { PATHS } from 'src/util/paths'
import { EventRankBadge } from '../events/components/EventRankBadge'
import { AgeGroupRoleSelector } from './components/AgeGroupRoleSelector'
import { CategoriesBarChart } from './components/CategoriesBarChart'
import { CriteriaBarChart } from './components/CriteriaBarChart'
import { RatingMessage } from './components/RatingMessage'

export const ResultDetailsPage = () => {
  const { eventId } = useParams()
  const nav = useNavigate()
  const { data: event, isLoading, error } = useFetchEventResults(+eventId!)
  const { data: messageData, isLoading: messagesLoading, error: messagesError, refetch } = useFetchEventMessages(+eventId!)
  const [filteredMessages, setFilteredMessages] = useState<PublicEventMessage[]>([])
  const { selectedAgeGroups, selectedRoles } = useResultTableContext()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>()

  useEffect(() => {
    if (messageData?.messages) {
      setFilteredMessages(messageData.messages.filter((m) => selectedRoles.includes(m.role) && selectedAgeGroups.includes(m.ageGroup)))
    }
  }, [messageData, selectedAgeGroups, selectedRoles])

  useEffect(() => {
    if (event) {
      setSelectedCategoryId(event.ratingResults.children?.[0].categoryId)
    }
  }, [event])

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error || !event || messagesError) {
    return (
      <NavigateWithError
        error={error || messagesError || { message: 'Nem sikerült betölteni a verseny értékelési eredményeit', statusCode: 500 }}
        to={PATHS.INDEX}
      />
    )
  }

  return (
    <VStack alignItems="flex-start" spacing={3} w="100%" h="100%">
      <HelmetTitle title={`Pontoz-O | ${event.name}`} />
      <Heading>{event.name}</Heading>
      <HStack w="100%">
        <Heading size="md">{formatDateRange(event.startDate, event.endDate)}</Heading>
        <EventRankBadge event={event} fontSize="1rem" />
      </HStack>
      <Box>
        <Text>
          <b>Rendező{event.organisers.length > 1 && 'k'}:</b> {event.organisers.map((o) => o.shortName).join(', ')}
        </Text>
        <Text>
          Összesen <b>{event.totalRatingCount}</b> felhasználó értékelte a versenyt.
        </Text>
        {event.scoresCalculatedAt && (
          <Text>
            Az eredmények számításának időpontja: <b>{formatDate(event.scoresCalculatedAt)}</b>
          </Text>
        )}
      </Box>
      <HStack flexWrap="wrap">
        <Button onClick={() => nav(`${PATHS.EVENTS}/${eventId}`)} leftIcon={<FaStar />} colorScheme="brand">
          Értékelési oldal
        </Button>
        <Button
          leftIcon={<FaDatabase />}
          onClick={() => window.open(`http://adatbank.mtfsz.hu/esemeny/show/esemeny_id/${event.id}`, '_blank', 'noopener,noreferrer')}
          colorScheme="red"
          bg="mtfszRed"
        >
          MTFSZ Adatbank
        </Button>
      </HStack>
      <Stack direction={['column', 'column', 'row']} gap={2} w="100%">
        <AgeGroupRoleSelector />
      </Stack>
      <Heading size="md">Kategóriák szerinti eredmények</Heading>
      <CategoriesBarChart event={event} setSelectedCategoryId={setSelectedCategoryId} />
      <Heading size="md">Szempontok szerinti eredmények</Heading>
      <VStack gap={0.5} alignItems="flex-start" width={['100%', '100%', '33%']}>
        <FormLabel>Kategória</FormLabel>
        <Select bg="white" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}>
          {event.ratingResults.children?.map((cat) => (
            <option value={cat.categoryId} key={cat.categoryId}>
              {cat.category?.name}
            </option>
          ))}
        </Select>
      </VStack>
      <CriteriaBarChart event={event} selectedCategoryId={selectedCategoryId} />
      <Heading size="md">Szöveges visszajelzések</Heading>
      {(filteredMessages.length === 0 || messagesLoading) && (
        <Text align="center" fontStyle="italic">
          Erre a versenyre nem érkezett a szűrőknek megfelelő szöveges visszajelzés
        </Text>
      )}
      {filteredMessages.map((pem) => (
        <RatingMessage key={pem.eventRatingId} ratingWithMessage={pem} refetchMessages={refetch} />
      ))}
    </VStack>
  )
}

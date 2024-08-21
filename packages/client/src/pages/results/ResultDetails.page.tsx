import { FormLabel, Heading, HStack, Link as ChakraLink, Select, Stack, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchEventResults } from 'src/api/hooks/resultHooks'
import { HelmetTitle } from 'src/components/commons/HelmetTitle'
import { LoadingSpinner } from 'src/components/commons/LoadingSpinner'
import { NavigateWithError } from 'src/components/commons/NavigateWithError'
import { formatDateRange } from 'src/util/formatDateRange'
import { PATHS } from 'src/util/paths'
import { ALL_ROLES } from '../../../../common/src'
import { EventRankBadge } from '../events/components/EventRankBadge'
import { AgeGroupRoleSelector } from './components/AgeGroupRoleSelector'
import { CategoryBarChart } from './components/CategoriesBarChart'
import { CriteriaBarChart } from './components/CriteriaBarChart'

export const ResultDetailsPage = () => {
  const { eventId } = useParams()
  const { data: event, isLoading, error } = useFetchEventResults(+eventId!)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>()
  const [ratingCount, setRatingCount] = useState<number>()

  useEffect(() => {
    if (event) {
      setSelectedCategoryId(event.ratingResults.children?.[0].categoryId)
      for (const catRes of event.ratingResults.children!) {
        for (const critRes of catRes.children!) {
          if (
            critRes.criterion &&
            !critRes.criterion.allowEmpty &&
            !critRes.criterion.stageSpecific &&
            critRes.criterion.roles.length === ALL_ROLES.length
          ) {
            setRatingCount(critRes.items.find((rri) => !rri.ageGroup && !rri.role)?.count)
            return
          }
        }
      }
    }
  }, [event])

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error || !event) {
    return (
      <NavigateWithError
        error={error || { message: 'Nem sikerült betölteni a verseny értékelési eredményeit', statusCode: 500 }}
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
      <Text>
        <b>Rendező{event.organisers.length > 1 && 'k'}:</b> {event.organisers.map((o) => o.shortName).join(', ')}
        {ratingCount && (
          <Text>
            Összesen <b>{ratingCount}</b> felhasználó értékelte a versenyt.
          </Text>
        )}
      </Text>

      <ChakraLink color="brand.500" fontWeight="bold" href={`http://adatbank.mtfsz.hu/esemeny/show/esemeny_id/${event.id}`} target="_blank">
        MTFSZ Adatbank esemény
      </ChakraLink>
      <Stack direction={['column', 'column', 'row']} gap={2} w="100%">
        <AgeGroupRoleSelector />
      </Stack>

      <Heading size="md">Kategóriák szerinti eredmények</Heading>

      <CategoryBarChart event={event} setSelectedCategoryId={setSelectedCategoryId} />
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
    </VStack>
  )
}

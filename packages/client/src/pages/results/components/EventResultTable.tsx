import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { AgeGroup, EventResultList, RatingRole } from '@pontozo/common'
import { EventResultCell } from './EventResultCell'

interface Props {
  results: EventResultList
  includeTotal: boolean
  roles: RatingRole[]
  ageGroups: AgeGroup[]
}

export const EventResultTable = ({ results: { categories, criteria, eventResults }, roles, ageGroups, includeTotal }: Props) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="green" whiteSpace="normal">
        <Thead top={0}>
          <Tr>
            <Th maxW="33%">Verseny</Th>
            {includeTotal && <Th textAlign="center">Összesített átlag</Th>}
            {categories.map((c) => (
              <Th textAlign="center" key={`cat-${c.id}`}>
                {c.name}
              </Th>
            ))}
            {criteria.map((c) => (
              <Th textAlign="center" key={`crit-${c.id}`}>
                {c.name}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {eventResults.map((er) => (
            <Tr key={er.eventId}>
              <Td>{er.eventName}</Td>
              {includeTotal && (
                <EventResultCell
                  resultItems={er.results.find((r) => !r.categoryId && !r.criterionId)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                />
              )}
              {categories.map((c) => (
                <EventResultCell
                  key={`cat-${c.id}`}
                  resultItems={er.results.find((r) => r.categoryId === c.id)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                />
              ))}
              {criteria.map((c) => (
                <EventResultCell
                  key={`crit-${c.id}`}
                  resultItems={er.results.find((r) => r.criterionId === c.id)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                />
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

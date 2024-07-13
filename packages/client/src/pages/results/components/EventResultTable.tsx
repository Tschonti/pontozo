import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { AgeGroup, EventResultList, RatingRole } from '@pontozo/common'
import { EventResultCell } from './EventResultCell'

interface Props {
  results: EventResultList
  includeTotal: boolean
  role?: RatingRole
  ageGroup?: AgeGroup
}

export const EventResultTable = ({ results: { categories, criteria, eventResults }, role, ageGroup, includeTotal }: Props) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="brand">
        <Thead>
          <Tr>
            <Th>Verseny</Th>
            {includeTotal && <Th isNumeric>Összesített átlag</Th>}
            {categories.map((c) => (
              <Th key={`cat-${c.id}`} isNumeric>
                {c.name}
              </Th>
            ))}
            {criteria.map((c) => (
              <Th key={`crit-${c.id}`} isNumeric>
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
                  role={role}
                  ageGroup={ageGroup}
                />
              )}
              {categories.map((c) => (
                <EventResultCell
                  key={`cat-${c.id}`}
                  resultItems={er.results.find((r) => r.categoryId === c.id)?.items ?? []}
                  role={role}
                  ageGroup={ageGroup}
                />
              ))}
              {criteria.map((c) => (
                <EventResultCell
                  key={`crit-${c.id}`}
                  resultItems={er.results.find((r) => r.criterionId === c.id)?.items ?? []}
                  role={role}
                  ageGroup={ageGroup}
                />
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

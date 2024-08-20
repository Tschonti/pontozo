import { Text } from '@chakra-ui/react'
import { AgeGroup, EventResultList, RatingRole } from '@pontozo/common'
import { Fragment, useEffect, useState } from 'react'
import { sortEvents } from '../../../../util/resultItemHelpers'
import { EventResultCell } from '../EventResultCell'
import { CriterionHeader } from './CriterionHeader'
import { TD } from './TD'
import { TH } from './TH'
import { TR } from './TR'

interface Props {
  results: EventResultList
  includeTotal: boolean
  roles: RatingRole[]
  ageGroups: AgeGroup[]
}

export type CriterionId = 'total' | `crit-${string}` | `cat-${string}`
export type SortOrder = 'desc' | 'asc'

export const EventResultTable = ({ results: { categories, criteria, eventResults }, roles, ageGroups, includeTotal }: Props) => {
  const [hoveredEventId, setHoveredEventId] = useState<number | undefined>(undefined)
  const [sortCriterion, setSortCriterion] = useState<CriterionId | undefined>()
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [sortedEvents, setSortedEvents] = useState(eventResults)

  const onCritClick = (id: CriterionId | undefined) => {
    if (sortCriterion === id && id) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortCriterion(id)
      setSortOrder('desc')
    }
  }

  useEffect(() => {
    if (!sortCriterion) {
      setSortedEvents(eventResults)
    } else if (sortCriterion === 'total') {
      setSortedEvents(sortEvents(eventResults, sortOrder, (r) => !r.categoryId && !r.criterionId, roles, ageGroups))
    } else {
      const [type, id] = sortCriterion.split('-')
      setSortedEvents(
        sortEvents(
          eventResults,
          sortOrder,
          (r) => (type === 'crit' ? r.criterionId === parseInt(id) : r.categoryId === parseInt(id)),
          roles,
          ageGroups
        )
      )
    }
  }, [sortOrder, sortCriterion, eventResults, ageGroups, roles])

  return (
    <table>
      <thead style={{ backgroundColor: '#7fd77f52' }}>
        <tr>
          <TH onClick={() => onCritClick(undefined)}>
            <CriterionHeader name="Verseny" criterionId={undefined} sortOrder={sortOrder} sortCriterion={sortCriterion} />
          </TH>
          {includeTotal && (
            <TH onClick={() => onCritClick('total')} centered>
              <CriterionHeader name="Összesített átlag" criterionId="total" sortOrder={sortOrder} sortCriterion={sortCriterion} />
            </TH>
          )}
          {categories.map((c) => (
            <TH onClick={() => onCritClick(`cat-${c.id}`)} centered key={`cat-h-${c.id}`}>
              <CriterionHeader name={c.name} criterionId={`cat-${c.id}`} sortOrder={sortOrder} sortCriterion={sortCriterion} />
            </TH>
          ))}
          {criteria.map((c) => (
            <TH onClick={() => onCritClick(`crit-${c.id}`)} centered key={`crit-h-${c.id}`}>
              <CriterionHeader name={c.name} criterionId={`crit-${c.id}`} sortOrder={sortOrder} sortCriterion={sortCriterion} />
            </TH>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedEvents.map((er, i) => (
          <Fragment key={er.eventId}>
            <TR index={i} eventId={er.eventId} hovered={hoveredEventId === er.eventId} setHoverEventId={setHoveredEventId}>
              <TD>
                <Text fontWeight="semibold" m={1}>
                  {er.eventName}
                </Text>
              </TD>

              {includeTotal && (
                <EventResultCell
                  resultItems={er.results.find((r) => !r.categoryId && !r.criterionId)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                  bold={true}
                />
              )}
              {categories.map((c) => (
                <EventResultCell
                  key={`cat-${c.id}-${er.eventId}`}
                  resultItems={er.results.find((r) => r.categoryId === c.id)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                  bold={true}
                />
              ))}
              {criteria.map((c) => (
                <EventResultCell
                  key={`crit-${c.id}-${er.eventId}`}
                  resultItems={er.results.find((r) => r.criterionId === c.id)?.items ?? []}
                  roles={roles}
                  ageGroups={ageGroups}
                  bold={true}
                />
              ))}
            </TR>
            {er.stages.map((s) => (
              <TR
                key={s.stageId}
                index={i}
                eventId={er.eventId}
                hovered={hoveredEventId === er.eventId}
                setHoverEventId={setHoveredEventId}
              >
                <TD>
                  <Text m={1} ml={5}>
                    {s.stageName}
                  </Text>
                </TD>
                {includeTotal && (
                  <EventResultCell
                    resultItems={s.results.find((r) => !r.categoryId && !r.criterionId)?.items ?? []}
                    roles={roles}
                    ageGroups={ageGroups}
                  />
                )}

                {categories.map((c) => (
                  <EventResultCell
                    key={`cat-${c.id}-${er.eventId}-${s.stageId}`}
                    resultItems={s.results.find((r) => r.categoryId === c.id)?.items ?? []}
                    roles={roles}
                    ageGroups={ageGroups}
                  />
                ))}
                {criteria.map((c) => (
                  <EventResultCell
                    key={`crit-${c.id}-${er.eventId}-${s.stageId}`}
                    resultItems={s.results.find((r) => r.criterionId === c.id)?.items ?? []}
                    roles={roles}
                    ageGroups={ageGroups}
                  />
                ))}
              </TR>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  )
}

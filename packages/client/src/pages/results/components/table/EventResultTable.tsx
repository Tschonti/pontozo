import { Text } from '@chakra-ui/react'
import { Fragment, useState } from 'react'
import { useResultTableContext } from 'src/api/contexts/useResultTableContext'
import { EventResultCell } from '../EventResultCell'
import { CriterionHeader } from './CriterionHeader'
import { TD } from './TD'
import { TH } from './TH'
import { TR } from './TR'

export const EventResultTable = () => {
  const [hoveredEventId, setHoveredEventId] = useState<number | undefined>(undefined)
  const { resultsData, includeTotal, sortOrder, sortCriterion, sortedEvents, sortByCrit } = useResultTableContext()

  if (!resultsData || sortedEvents.length === 0) {
    return (
      <Text textAlign="center" fontStyle="italic">
        Ebben a szezonban nincs a szűrőknek megfelelő versenyről eredmény.
      </Text>
    )
  }
  const { categories, criteria } = resultsData
  return (
    <table>
      <thead style={{ backgroundColor: '#7fd77f52' }}>
        <tr>
          <TH onClick={() => sortByCrit(undefined)}>
            <CriterionHeader name="Verseny" criterionId={undefined} sortOrder={sortOrder} sortCriterion={sortCriterion} />
          </TH>
          {includeTotal && (
            <TH onClick={() => sortByCrit('total')} centered>
              <CriterionHeader name="Összesített átlag" criterionId="total" sortOrder={sortOrder} sortCriterion={sortCriterion} />
            </TH>
          )}
          {categories.map((c) => (
            <TH onClick={() => sortByCrit(`cat-${c.id}`)} centered key={`cat-h-${c.id}`}>
              <CriterionHeader name={c.name} criterionId={`cat-${c.id}`} sortOrder={sortOrder} sortCriterion={sortCriterion} />
            </TH>
          ))}
          {criteria.map((c) => (
            <TH onClick={() => sortByCrit(`crit-${c.id}`)} centered key={`crit-h-${c.id}`}>
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

              {includeTotal && <EventResultCell ratingResult={er.results.find((r) => !r.categoryId && !r.criterionId)} bold={true} />}
              {categories.map((c) => (
                <EventResultCell
                  key={`cat-${c.id}-${er.eventId}`}
                  ratingResult={er.results.find((r) => r.categoryId === c.id)}
                  bold={true}
                />
              ))}
              {criteria.map((c) => (
                <EventResultCell
                  key={`crit-${c.id}-${er.eventId}`}
                  ratingResult={er.results.find((r) => r.criterionId === c.id)}
                  bold={true}
                />
              ))}
            </TR>
            {er.stages.length > 1 &&
              er.stages.map((s) => (
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
                  {includeTotal && <EventResultCell ratingResult={s.results.find((r) => !r.categoryId && !r.criterionId)} />}

                  {categories.map((c) => (
                    <EventResultCell
                      key={`cat-${c.id}-${er.eventId}-${s.stageId}`}
                      ratingResult={s.results.find((r) => r.categoryId === c.id)}
                    />
                  ))}
                  {criteria.map((c) => (
                    <EventResultCell
                      key={`crit-${c.id}-${er.eventId}-${s.stageId}`}
                      ratingResult={s.results.find((r) => r.criterionId === c.id)}
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

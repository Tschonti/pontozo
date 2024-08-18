import { Text } from '@chakra-ui/react'
import { AgeGroup, EventResultList, RatingRole } from '@pontozo/common'
import { Fragment } from 'react'
import { EventResultCell } from '../EventResultCell'
import { TD } from './TD'
import { TH } from './TH'
import { TR } from './TR'

interface Props {
  results: EventResultList
  includeTotal: boolean
  roles: RatingRole[]
  ageGroups: AgeGroup[]
}

export const EventResultTable = ({ results: { categories, criteria, eventResults }, roles, ageGroups, includeTotal }: Props) => {
  return (
    <table>
      <thead style={{ backgroundColor: '#7fd77f52' }}>
        <tr>
          <TH>Verseny</TH>
          {includeTotal && <TH centered>Összesített átlag</TH>}
          {categories.map((c) => (
            <TH centered key={`cat-h-${c.id}`}>
              {c.name}
            </TH>
          ))}
          {criteria.map((c) => (
            <TH centered key={`crit-h-${c.id}`}>
              {c.name}
            </TH>
          ))}
        </tr>
      </thead>
      <tbody>
        {eventResults.map((er, i) => (
          <Fragment key={er.eventId}>
            <TR index={i}>
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
              <TR key={s.stageId} index={i}>
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

import { Criterion as Criterion_DTO, DbEvent, EventWithResults, RatingResultWithJoins } from '@pontozo/common'
import Criterion_DB from '../typeorm/entities/Criterion'
import { RatingResult as RR_DB } from '../typeorm/entities/RatingResult'

export const parseRatingResults = (results: RR_DB[], event: DbEvent): EventWithResults => {
  const parsed: RatingResultWithJoins[] = results.map((r) => ({
    ...r,
    items: JSON.parse(r.items),
    criterion: parseCriterion(r.criterion),
    children: r.children.map((c) => ({
      ...c,
      items: JSON.parse(c.items),
      criterion: parseCriterion(c.criterion),
      // Trust me, I'm smarter than TypeScript
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: c.children.map((cc) => ({ ...cc, items: JSON.parse(cc.items), criterion: parseCriterion(cc.criterion) } as any)),
    })),
  }))
  return {
    ...event,
    ratingResults: parsed.find((r) => !r.stageId),
    stages: event.stages.map((s) => ({ ...s, ratingResults: parsed.find((r) => r.stageId === s.id) })),
  }
}

const parseCriterion = (c: Criterion_DB | undefined): Criterion_DTO => {
  if (!c) return undefined
  return {
    ...c,
    roles: JSON.parse(c.roles),
  }
}

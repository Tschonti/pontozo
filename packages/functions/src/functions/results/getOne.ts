import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { IsNull } from 'typeorm'
import Event from '../../typeorm/entities/Event'
import { RatingResult } from '../../typeorm/entities/RatingResult'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const getOneResult = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const eventId = parseInt(req.params.eventId)
    if (isNaN(eventId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }

    const ads = await getAppDataSource(context)
    const eventQuery = ads.getRepository(Event).findOne({ where: { id: eventId }, relations: { organisers: true, stages: true } })
    const resultsQuery = ads
      .getRepository(RatingResult)
      .find({ where: { eventId: eventId, parentId: IsNull() }, relations: { children: { category: true, children: { criterion: true } } } })
    const [event, results] = await Promise.all([eventQuery, resultsQuery])

    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    const parsedResults = results.map((r) => ({
      ...r,
      items: JSON.parse(r.items),
      children: r.children.map((c) => ({
        ...c,
        items: JSON.parse(c.items),
        children: c.children.map((cc) => ({ ...cc, items: JSON.parse(cc.items) })),
      })),
    }))
    return {
      jsonBody: {
        ...event,
        ratingResults: parsedResults.find((r) => !r.stageId),
        stages: event.stages.map((s) => ({ ...s, ratingResults: parsedResults.find((r) => r.stageId === s.id) })),
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-getOne', {
  methods: ['GET'],
  route: 'results/{eventId}',
  handler: getOneResult,
})

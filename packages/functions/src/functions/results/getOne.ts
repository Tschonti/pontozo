import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EventState, PontozoException } from '@pontozo/common'
import { IsNull } from 'typeorm'
import { getRedisClient } from '../../redis/redisClient'
import Event from '../../typeorm/entities/Event'
import { RatingResult } from '../../typeorm/entities/RatingResult'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { parseRatingResults } from '../../util/parseRatingResults'

export const getOneResult = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const eventId = parseInt(req.params.eventId)
    if (isNaN(eventId)) {
      throw new PontozoException('Érvénytelen azonosító!', 400)
    }

    const redisClient = await getRedisClient(context)
    const ratingResult = await redisClient.get(`ratingResult:${eventId}`)
    if (ratingResult) {
      return {
        jsonBody: JSON.parse(ratingResult),
      }
    }

    const ads = await getAppDataSource(context)
    const event = await ads.getRepository(Event).findOne({ where: { id: eventId }, relations: { organisers: true, stages: true } })
    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    if (event.state !== EventState.RESULTS_READY) {
      throw new PontozoException('A verseny értékelési eredményei még nem elérhetőek!', 404)
    }

    const results = await ads
      .getRepository(RatingResult)
      .find({ where: { eventId: eventId, parentId: IsNull() }, relations: { children: { category: true, children: { criterion: true } } } })

    return {
      jsonBody: parseRatingResults(results, event),
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

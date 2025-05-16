import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventState, EventWithResults, PontozoException } from '@pontozo/common'
import { IsNull } from 'typeorm'
import Event from '../../typeorm/entities/Event'
import { RatingResult } from '../../typeorm/entities/RatingResult'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { parseRatingResults } from '../../util/parseRatingResults'
import { PontozoResponse } from '../../util/pontozoResponse'
import { getRedisClient } from '../../util/redisClient'
import { validateId } from '../../util/validation'

export const getOneResult = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventWithResults>> => {
  try {
    const eventId = validateId(req)

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
    const parsedData = parseRatingResults(results, event)
    await redisClient.set(`ratingResult:${eventId}`, JSON.stringify(parsedData))
    return {
      jsonBody: parsedData,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-getOne', {
  methods: ['GET'],
  route: 'results/{id}',
  handler: getOneResult,
})

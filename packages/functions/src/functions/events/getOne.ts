import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventWithRating, PontozoException } from '@pontozo/common'
import { getUserFromHeaderIfPresent } from '../../service/auth.service'
import Event from '../../typeorm/entities/Event'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

/**
 * Called when the user visits an event page to get the event data and the user's rating.
 */
export const getOneEvent = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventWithRating>> => {
  try {
    const eventId = validateId(req)

    const user = getUserFromHeaderIfPresent(req)
    const ads = await getAppDataSource(context)
    const eventQuery = ads.getRepository(Event).findOne({ where: { id: eventId }, relations: { organisers: true, stages: true } })
    const userRatingQuery = ads
      .getRepository(EventRating)
      .findOne({ where: { eventId: eventId, userId: user?.szemely_id }, relations: { stages: true } })
    const [event, userRating] = await Promise.all([eventQuery, user ? userRatingQuery : Promise.resolve(undefined)])

    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    return {
      jsonBody: {
        event,
        userRating,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('events-getOne', {
  methods: ['GET'],
  route: 'events/getOne/{id}',
  handler: getOneEvent,
})

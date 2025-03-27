import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventWithRating, PontozoException, RatingStatus } from '@pontozo/common'
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
    const erRepo = ads.getRepository(EventRating)
    const eventQuery = ads.getRepository(Event).findOne({ where: { id: eventId }, relations: { organisers: true, stages: true } })
    const userRatingQuery = erRepo.findOne({ where: { eventId, userId: user?.szemely_id }, relations: { stages: true } })
    const allRatingsQuery = erRepo.find({ where: { eventId } })
    const [event, userRating, allRatings] = await Promise.all([eventQuery, user ? userRatingQuery : Promise.resolve(null), allRatingsQuery])

    if (!event) {
      throw new PontozoException('A verseny nem található!', 404)
    }
    const now = new Date().getTime()
    let submittedRatingCount = 0
    let editingNow = 0
    allRatings.forEach((er) => {
      if (er.status === RatingStatus.SUBMITTED) {
        submittedRatingCount++
        return
      }
      // ratings started in the past hour that haven't been submitted yet
      if (new Date(er.createdAt).getTime() > now - 1000 * 60 * 60) {
        editingNow++
      }
    })
    return {
      jsonBody: {
        event,
        userRating,
        submittedRatingCount,
        editingNow,
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

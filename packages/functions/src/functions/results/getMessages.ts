import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { EventMessages, getAgeGroupFromAge, RatingStatus } from '@pontozo/common'
import { IsNull, Not } from 'typeorm'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'
import { validateId } from '../../util/validation'

/**
 * Called when a user visits an event result page to get the extra messages to the event.
 */
export const getMessages = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<EventMessages>> => {
  try {
    const eventId = validateId(req)

    const ratingRepo = (await getAppDataSource(context)).getRepository(EventRating)
    const ratingsWithMessages = await ratingRepo.find({
      where: { eventId, message: Not(IsNull()), status: RatingStatus.SUBMITTED },
    })
    return {
      jsonBody: {
        messages: ratingsWithMessages.map((er) => ({
          eventRatingId: er.id,
          message: er.message as string,
          role: er.role,
          ageGroup: getAgeGroupFromAge(er.raterAge),
        })),
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('results-getMessages', {
  methods: ['GET'],
  route: 'results/{id}/messages',
  handler: getMessages,
})

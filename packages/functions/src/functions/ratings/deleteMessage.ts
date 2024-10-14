import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

/**
 * Called when an admin decides to delete a message (event rating comment) because of inappropriate content
 */
export const deleteMessage = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const eventRatingId = validateId(req)
    await getUserFromHeaderAndAssertAdmin(req, context)

    const ratingRepo = (await getAppDataSource(context)).getRepository(EventRating)
    const rating = await ratingRepo.findOne({
      where: { id: eventRatingId },
    })
    if (!rating) {
      throw new PontozoException('Értékelés nem található!', 404)
    }
    rating.message = null
    await ratingRepo.save(rating)
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-deleteMessage', {
  methods: ['DELETE'],
  route: 'ratings/{id}',
  handler: deleteMessage,
})

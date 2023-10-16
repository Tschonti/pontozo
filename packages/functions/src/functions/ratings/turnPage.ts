import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PageTurn, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

/**
 * Called when the user goes to the next or previous page during the rating of an event.
 * HTTP body should be PageTurn DTO
 */
export const turnPage = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const id = validateId(req)
    validateBody(req)
    const user = getUserFromHeader(req)
    const dto = plainToClass(PageTurn, await req.json())
    await validateWithWhitelist(dto)
    const ads = await getAppDataSource(context)
    const eventRatingRepo = ads.getRepository(EventRating)

    const eventRating = await eventRatingRepo.findOne({ where: { id }, relations: { event: true } })

    if (eventRating === null) {
      throw new PontozoException('Az értékelés nem található!', 404)
    }
    if (eventRating.userId !== user.szemely_id) {
      throw new PontozoException('Nincs jogosultságod megtekinteni ezt az értékelést!', 403)
    }
    eventRating.currentCategoryIdx = dto.categoryIdx
    eventRating.currentStageIdx = dto.stageIdx

    await eventRatingRepo.save(eventRating)

    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-turnPage', {
  methods: ['POST'],
  route: 'ratings/{id}/turn',
  handler: turnPage,
})

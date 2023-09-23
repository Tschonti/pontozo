import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { GetCriterionRatings, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

/**
 * Called when the user switches pages during the rating of an event to get their previous ratings on the current criteria.
 * HTTP body should be GetCriterionRatings, with an array of criterionIds, whose ratings will be returned.
 */
export const getCriterionRatings = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const ratingId = validateId(req)
    validateBody(req)
    const user = getUserFromHeader(req)
    const dto = plainToClass(GetCriterionRatings, await req.json())
    await validateWithWhitelist(dto)

    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const criterionRatingRepo = ads.getRepository(CriterionRating)

    const eventRating = await eventRatingRepo.findOne({ where: { id: ratingId } })
    if (eventRating === null) {
      throw new PontozoException('Az értékelés nem található!', 404)
    }
    if (eventRating.userId !== user.szemely_id) {
      throw new PontozoException('Nincs jogosultságod a szempontok lekéréshez', 403)
    }
    const stageId = dto.stageId || null
    const ratings = await criterionRatingRepo.find({ where: { criterionId: In(dto.criterionIds), eventRatingId: eventRating.id, stageId } })

    return {
      jsonBody: ratings,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-getCriterionRatings', {
  methods: ['POST'],
  route: 'ratings/{id}/criteria',
  handler: getCriterionRatings,
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { EventState, isHigherRank, PontozoException, RatingStatus, SubmitEventRating } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

/**
 * Called when the users submits their rating of an event.
 * Checks that all criteria has been rated.
 */
export const submitOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const id = validateId(req)
    const user = getUserFromHeader(req)
    validateBody(req)
    const dto = plainToClass(SubmitEventRating, await req.json())
    await validateWithWhitelist(dto)

    const ads = await getAppDataSource(context)
    const eventRatingRepo = ads.getRepository(EventRating)
    const rating = await eventRatingRepo.findOne({
      where: { id },
      relations: { ratings: true, event: { season: { criterionCount: true } }, stages: true },
    })

    if (!rating) {
      throw new PontozoException('Az értékelés nem létezik!', 404)
    }

    if (rating.status === RatingStatus.SUBMITTED) {
      throw new PontozoException('Az értékelés már véglegesítve lett!', 400)
    }
    if (rating.userId !== user.szemely_id) {
      throw new PontozoException('Te nem véglegesítheted ezt az értékelést!', 403)
    }
    if (rating.event.state !== EventState.RATEABLE) {
      throw new PontozoException('Ezt a versenyt már nem lehet értékelni!', 400)
    }
    const { season } = rating.event
    const scc = season.criterionCount.find((cc) => cc.role === rating.role)
    if (!scc) {
      throw new PontozoException('A szezon még nem lett inicializálva, kérlek próbáld újra holnap!', 409)
    }
    let criterionCount = scc.eventSpecificAnyRank + rating.stages.length * scc.stageSpecificAnyRank
    if (isHigherRank(rating.event)) {
      criterionCount += scc.eventSpecificHigherRank + rating.stages.length * scc.stageSpecificHigherRank
    }

    if (criterionCount !== rating.ratings.length) {
      throw new PontozoException('Nem értékelted le a versenyt az összes szempont szerint!', 400)
    }

    if (dto.message) {
      rating.message = dto.message
    }
    rating.status = RatingStatus.SUBMITTED
    rating.submittedAt = new Date()
    await eventRatingRepo.save(rating)

    context.log(`User #${user.szemely_id} submitted Rating #${rating.id} for Event #${rating.eventId}`)
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-submit', {
  methods: ['POST'],
  route: 'ratings/{id}/submit',
  handler: submitOne,
})

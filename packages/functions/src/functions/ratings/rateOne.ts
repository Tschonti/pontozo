import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCriterionRating, PontozoException, RatingStatus } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { In, InsertResult } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating from '../../typeorm/entities/EventRating'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

/**
 * Called when the user changes the rating of a criteria during the rating of an event.
 * HTTP body should be CreateRatingDto
 */
export const rateOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const id = validateId(req)
    validateBody(req)
    const user = getUserFromHeader(req)
    const dto = plainToClass(CreateCriterionRating, await req.json())
    await validateWithWhitelist(dto)
    const ads = await getAppDataSource(context)
    const eventRatingRepo = ads.getRepository(EventRating)
    const criterionRepo = ads.getRepository(Criterion)

    const eventRatingQuery = eventRatingRepo.findOne({ where: { id }, relations: { event: true } })
    const criterionQuery = criterionRepo.findOneBy({ id: dto.criterionId })

    const [eventRating, criterion] = await Promise.all([eventRatingQuery, criterionQuery])
    if (eventRating === null) {
      throw new PontozoException('Az értékelés nem található!', 404)
    }
    if (eventRating.status === RatingStatus.SUBMITTED) {
      throw new PontozoException('Az értékelés már végelesítve lett!', 400)
    }
    if (eventRating.userId !== user.szemely_id) {
      throw new PontozoException('Nincs jogosultságod értékelni ezt a szempontot!', 403)
    }
    if (!eventRating.event.rateable) {
      throw new PontozoException('Ez a verseny már nem értékelhető!', 400)
    }
    if (criterion === null) {
      throw new PontozoException('Szempont nem található!', 404)
    }
    if (!JSON.parse(criterion.roles).includes(eventRating.role)) {
      throw new PontozoException('Ezen szempont értékelése nem engedett a te szerepköröddel!', 403)
    }
    if (dto.value >= 0 || dto.value < -1) {
      if (!criterion[`text${dto.value}`]) {
        throw new PontozoException('Érvénytelen értékelés!', 400)
      }
    } else if (!criterion.allowEmpty) {
      throw new PontozoException('Ezt a szempontot kötelező értékelni!', 400)
    }
    if (criterion.stageSpecific !== !!dto.stageId) {
      throw new PontozoException('A futam azonosítója hiányzik, vagy nem megengedett!', 400)
    }

    const ctcRepo = ads.getRepository(CategoryToCriterion)
    const stcRepo = ads.getRepository(SeasonToCategory)
    const ctcs = await ctcRepo.find({ where: { criterionId: dto.criterionId } })
    const stcs = await stcRepo.find({ where: { seasonId: eventRating.event.seasonId, categoryId: In(ctcs.map((ctc) => ctc.categoryId)) } })

    if (stcs.length === 0) {
      throw new PontozoException('Ezt a szempontot nem lehet értékelni a jelenlegi szezonban!', 400)
    }

    const criterionRatingRepo = ads.getRepository(CriterionRating)
    const rating = await criterionRatingRepo.findOneBy({ criterion: { id: dto.criterionId }, eventRating: { id }, stageId: dto.stageId })
    let result: InsertResult
    if (rating === null) {
      result = await criterionRatingRepo.insert({
        criterion: { id: dto.criterionId },
        value: dto.value,
        eventRating: { id },
        stageId: dto.stageId,
      })
    } else {
      rating.value = dto.value
      await criterionRatingRepo.save(rating)
    }

    context.log(
      `User #${user.szemely_id} saved CriterionRating #${result ? result.identifiers[0].id : rating.id} for Event #${
        eventRating.eventId
      }, Criterion #${criterion.id}`
    )
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('ratings-rateOne', {
  methods: ['POST'],
  route: 'ratings/{id}',
  handler: rateOne,
})

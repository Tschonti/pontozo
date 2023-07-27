import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating from '../../typeorm/entities/EventRating'
import { SeasonToCategory } from '../../typeorm/entities/SeasonToCategory'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { validateWithWhitelist } from '../../util/validation'
import { CreateCriterionRating, RatingStatus } from '@pontozo/common'

/**
 * Called when the user changes the rating of a criteria during the rating of an event.
 * HTTP body should be CreateRatingDto
 */
export const rateOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid eventRating id!',
    }
  }
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`,
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  const dto = plainToClass(CreateCriterionRating, await req.json())
  const errors = await validateWithWhitelist(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors,
    }
  }
  try {
    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const criterionRepo = ads.getRepository(Criterion)

    const eventRatingQuery = eventRatingRepo.findOne({ where: { id }, relations: { event: true } })
    const criterionQuery = criterionRepo.findOneBy({ id: dto.criterionId })

    const [eventRating, criterion] = await Promise.all([eventRatingQuery, criterionQuery])
    if (eventRating === null) {
      return {
        status: 404,
        body: 'Rating not found',
      }
    }
    if (eventRating.status === RatingStatus.SUBMITTED) {
      return {
        status: 400,
        body: 'Rating already submitted!',
      }
    }
    if (eventRating.userId !== userServiceRes.data.szemely_id) {
      return {
        status: 403,
        body: "You're not allowed to rate this criteria",
      }
    }
    if (criterion === null) {
      return {
        status: 404,
        body: 'Criterion not found',
      }
    }
    if (!JSON.parse(criterion.roles).includes(eventRating.role)) {
      return {
        status: 403,
        body: 'Rating this criterion with this role is not allowed.',
      }
    }
    if (dto.value >= 0) {
      if (!criterion[`text${dto.value}`]) {
        return {
          status: 400,
          body: 'Invalid rating value!',
        }
      }
    } else if (!criterion.allowEmpty) {
      return {
        status: 400,
        body: 'This criterion must be rated!',
      }
    }

    if (criterion.stageSpecific !== !!dto.stageId) {
      return {
        status: 400,
        body: 'Stage ID missing or not allowed!',
      }
    }

    const ctcRepo = ads.getRepository(CategoryToCriterion)
    const stcRepo = ads.getRepository(SeasonToCategory)
    const ctcs = await ctcRepo.find({ where: { criterionId: dto.criterionId } })
    const stcs = await stcRepo.find({ where: { seasonId: eventRating.event.seasonId, categoryId: In(ctcs.map((ctc) => ctc.categoryId)) } })

    if (stcs.length === 0) {
      return {
        status: 400,
        body: 'This criterion cannot be rated this season!',
      }
    }

    const criterionRatingRepo = ads.getRepository(CriterionRating)
    const rating = await criterionRatingRepo.findOneBy({ criterion: { id: dto.criterionId }, eventRating: { id }, stageId: dto.stageId })
    if (rating === null) {
      await criterionRatingRepo.insert({ criterion: { id: dto.criterionId }, value: dto.value, eventRating: { id }, stageId: dto.stageId })
    } else {
      rating.value = dto.value
      await criterionRatingRepo.save(rating)
    }
    return {
      status: 204,
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      body: e,
    }
  }
}

app.http('ratings-rateOne', {
  methods: ['POST'],
  route: 'ratings/{id}',
  handler: rateOne,
})

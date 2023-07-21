import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeader } from '../../service/auth.service'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { validateWithWhitelist } from '../../util/validation'
import { GetCriterionRatings } from '@pontozo/types'

/**
 * Called when the user switches pages during the rating of an event to get their previous ratings on the current criteria.
 * HTTP body should be GetCriterionRatings, with an array of criterionIds, whose ratings will be returned.
 */
export const getCriterionRatings = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const ratingId = parseInt(req.params.id)

  if (isNaN(ratingId)) {
    return {
      status: 400,
      body: 'Invalid ID',
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

  const dto = plainToClass(GetCriterionRatings, await req.json())
  const errors = await validateWithWhitelist(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors,
    }
  }

  const ads = await getAppDataSource()
  const eventRatingRepo = ads.getRepository(EventRating)
  const criterionRatingRepo = ads.getRepository(CriterionRating)

  const eventRating = await eventRatingRepo.findOne({ where: { id: ratingId } })
  if (eventRating === null) {
    return {
      status: 404,
      body: 'Rating not found!',
    }
  }
  if (eventRating.userId !== userServiceRes.data.szemely_id) {
    return {
      status: 403,
      body: "You're not allowed to get criteria for this rating",
    }
  }
  const stageId = dto.stageId || null
  const ratings = await criterionRatingRepo.find({ where: { criterionId: In(dto.criterionIds), eventRatingId: eventRating.id, stageId } })

  return {
    jsonBody: ratings,
  }
}

app.http('ratings-getCriterionRatings', {
  methods: ['POST'],
  route: 'ratings/{id}/criteria',
  handler: getCriterionRatings,
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeader } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import CriterionRating from '../../typeorm/entities/CriterionRating'
import EventRating, { RatingStatus } from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateRatingDto } from './types/createRating.dto'

export const rateOne = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid eventRating id!'
    }
  }
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  const dto = plainToClass(CreateRatingDto, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors
    }
  }
  try {
    const ads = await getAppDataSource()
    const eventRatingRepo = ads.getRepository(EventRating)
    const criterionRepo = ads.getRepository(Criterion)

    const eventRatingQuery = eventRatingRepo.findOneBy({ id })
    const criterionQuery = criterionRepo.findOneBy({ id: dto.criterionId })

    const [eventRating, criterion] = await Promise.all([eventRatingQuery, criterionQuery])
    if (eventRating === null) {
      return {
        status: 404,
        body: 'Rating not found'
      }
    }
    if (eventRating.status === RatingStatus.SUBMITTED) {
      return {
        status: 400,
        body: 'Rating already submitted!'
      }
    }
    if (eventRating.userId !== userServiceRes.data.szemely_id) {
      return {
        status: 403,
        body: "You're not allowed to rate this criteria"
      }
    }
    if (criterion === null) {
      return {
        status: 404,
        body: 'Criterion not found'
      }
    }
    if (!JSON.parse(criterion.roles).includes(eventRating.role)) {
      return {
        status: 403,
        body: 'Rating this criterion with this role is not allowed.'
      }
    }
    if (!criterion[`text${dto.value}`]) {
      return {
        status: 400,
        body: 'Invalid rating value!'
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
      status: 204
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      body: e
    }
  }
}

app.http('ratings-rateOne', {
  methods: ['POST'],
  route: 'ratings/{id}',
  handler: rateOne
})

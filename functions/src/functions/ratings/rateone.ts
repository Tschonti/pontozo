import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import Criterion from '../../lib/typeorm/entities/Criterion'
import CriterionRating from '../../lib/typeorm/entities/CriterionRating'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, myvalidate, ResponseParams } from '../../lib/util'
import { CreateRatingDto } from './types/createRating.dto'

export const rateOne = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
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
  const dto = plainToClass(CreateRatingDto, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      body: errors
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
    const criterionRatingRepo = ads.getRepository(CriterionRating)
    const rating = await criterionRatingRepo.findOneBy({ criterion: { id: dto.criterionId }, eventRating: { id } })
    if (rating === null) {
      await criterionRatingRepo.insert({ criterion: { id: dto.criterionId }, value: dto.value, eventRating: { id } })
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

app.http('ratings-rateone', {
  methods: ['POST'],
  route: 'ratings/{id}',
  handler: (req, context) => JsonResWrapper(rateOne(req, context))
})

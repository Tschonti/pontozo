import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import CriterionRating from '../../lib/typeorm/entities/CriterionRating'
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

  try {
    const dto = plainToClass(CreateRatingDto, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        body: errors
      }
    }
    const ratingRepo = (await getAppDataSource()).getRepository(CriterionRating)
    const rating = await ratingRepo.findOneBy({ criterion: { id: dto.criterionId }, eventRating: { id } })
    if (rating === null) {
      await ratingRepo.insert({ criterion: { id: dto.criterionId }, value: dto.value, eventRating: { id } })
    } else {
      rating.value = dto.value
      await ratingRepo.save(rating)
    }
    return {
      status: 204
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('ratings-rateone', {
  methods: ['POST'],
  route: 'ratings/{id}',
  handler: (req, context) => JsonResWrapper(rateOne(req, context))
})

import { app, HttpRequest, InvocationContext } from '@azure/functions'
import CriterionRating from '../../lib/typeorm/entities/CriterionRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'
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
  const ratingRepo = (await getAppDataSource()).getRepository(CriterionRating)

  try {
    const body = (await req.json()) as CreateRatingDto
    const rating = await ratingRepo.findOneBy({ criterion: { id: body.criterionId }, eventRating: { id } })
    if (rating === null) {
      await ratingRepo.insert({ criterion: { id: body.criterionId }, value: body.value, eventRating: { id } })
    } else {
      rating.value = body.value
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

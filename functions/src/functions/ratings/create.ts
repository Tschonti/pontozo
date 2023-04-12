import { app, HttpRequest, InvocationContext } from '@azure/functions'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'
import { CreateRatingDto } from './types/createRating.dto'

export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }
  const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
  try {
    const body = (await req.json()) as CreateRatingDto
    const res = await ratingRepo.insert({ ...body, createdAt: new Date() })
    return {
      body: res.raw
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('ratings-create', {
  methods: ['POST'],
  route: 'ratings',
  handler: (req, context) => JsonResWrapper(createRating(req, context))
})

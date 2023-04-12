import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, myvalidate, ResponseParams } from '../../lib/util'
import { CreateEventRatingDto } from './types/createEventRating.dto'

export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }
  try {
    const dto = plainToClass(CreateEventRatingDto, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        body: errors
      }
    }
    const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
    const res = await ratingRepo.insert({ ...dto, createdAt: new Date() })
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

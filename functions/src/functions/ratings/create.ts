import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import EventRating from '../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../typeorm/getConfig'
import { myvalidate } from '../../util/validation'
import { CreateEventRatingDto } from './types/createEventRating.dto'

export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
        jsonBody: errors
      }
    }
    const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
    const res = await ratingRepo.insert({ ...dto, createdAt: new Date() })
    return {
      jsonBody: res.raw
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
  handler: createRating
})

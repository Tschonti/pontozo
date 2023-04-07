import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import EventRating from '../../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../../lib/typeorm/getConfig'

export const createRating = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  if (!req.body) {
    return {
      status: 400,
      body: `No body attached to POST query.`
    }
  }
  const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
  try {
    const res = await ratingRepo.insert({ ...req.body, createdAt: new Date() })
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
  handler: createRating
})

import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import EventRating from '../lib/typeorm/entities/EventRating'
import { getAppDataSource } from '../lib/typeorm/getConfig'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body) {
    context.res = {
      status: 400,
      body: { message: `No body attached to POST query.` }
    }
    return
  }
  const ratingRepo = (await getAppDataSource()).getRepository(EventRating)
  try {
    const res = await ratingRepo.insert({ ...req.body, createdAt: new Date() })
    context.res = {
      body: res.raw
    }
  } catch (e) {
    context.log(e)
    context.res = {
      status: 400,
      body: e
    }
  }
}

export default httpTrigger

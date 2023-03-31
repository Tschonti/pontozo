import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getAppDataSource } from '../lib/typeorm/config'
import Rating from '../lib/typeorm/entities/Rating'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const id = context.bindingData.id as number
  if (isNaN(id)) {
    context.res = {
      status: 400,
      body: 'Invalid id!'
    }
    return
  }
  if (!req.body) {
    context.res = {
      status: 400,
      body: { message: `No body attached to POST query.` }
    }
    return
  }
  const ratingRepo = (await getAppDataSource()).getRepository(Rating)

  try {
    const rating = await ratingRepo.insert({ criterion: { id }, value: req.body.value })
    context.res = {
      body: rating.raw
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

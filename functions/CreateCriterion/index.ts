import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { criterionRepo } from '../lib/typeorm/repositories'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (!req.body) {
    context.res = {
      status: 400,
      body: { message: `No body attached to POST query.` }
    }
    return
  }
  try {
    const res = await criterionRepo.insert(req.body)
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

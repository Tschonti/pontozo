import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { criterionRepo } from '../lib/typeorm/repositories'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const id = context.bindingData.id as number
  if (isNaN(id)) {
    context.res = {
      status: 400,
      body: 'Invalid id!'
    }
    return
  }
  try {
    const criteria = await criterionRepo.findOneBy({ id })
    if (!criteria) {
      context.res = {
        status: 404,
        body: 'Criterion not found!'
      }
      return
    }
    context.res = {
      body: criteria
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: error
    }
  }
}

export default httpTrigger

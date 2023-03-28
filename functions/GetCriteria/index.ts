import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { criterionRepo } from '../lib/typeorm/repositories'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const criteria = await criterionRepo.find()
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

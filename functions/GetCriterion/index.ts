import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getAppDataSource } from '../lib/typeorm/config'
import Criterion from '../lib/typeorm/entities/Criterion'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const id = context.bindingData.id as number
  if (isNaN(id)) {
    context.res = {
      status: 400,
      body: 'Invalid id!'
    }
    return
  }
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
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

import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import Criterion from '../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../lib/typeorm/getConfig'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
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

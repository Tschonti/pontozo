import { HttpRequest, HttpResponseInit, InvocationContext, app } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'

export const getCriteria = async (_req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criteria = await criterionRepo.find()
    return {
      body: JSON.stringify(criteria)
    }
  } catch (error) {
    context.log(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-getall', {
  methods: ['GET'],
  route: 'criteria',
  handler: getCriteria
})

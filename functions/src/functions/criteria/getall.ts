import { app, HttpRequest, InvocationContext } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'

export const getCriteria = async (_req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criteria = await criterionRepo.find()
    return {
      body: criteria
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
  handler: (req, context) => JsonResWrapper(getCriteria(req, context))
})

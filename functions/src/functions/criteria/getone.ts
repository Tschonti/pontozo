import { app, HttpRequest, InvocationContext } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'

export const getCriterion = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criteria = await criterionRepo.findOneBy({ id })
    if (!criteria) {
      return {
        status: 404,
        body: 'Criterion not found!'
      }
    }
    return {
      body: criteria
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-getone', {
  methods: ['GET'],
  route: 'criteria/{id}',
  handler: (req, context) => JsonResWrapper(getCriterion(req, context))
})

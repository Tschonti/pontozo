import { HttpRequest, HttpResponseInit, InvocationContext, app } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'

export const getCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
      body: JSON.stringify(criteria)
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
  handler: getCriterion
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'

export const deleteCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const res = await criterionRepo.delete({ id })
    return {
      jsonBody: res
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-deleteone', {
  methods: ['DELETE'],
  route: 'criteria/{id}',
  handler: deleteCriterion
})

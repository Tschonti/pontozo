import { app, HttpRequest, InvocationContext } from '@azure/functions'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, ResponseParams } from '../../lib/util'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const body = (await req.json()) as CreateCriteriaDTO
    const res = await criterionRepo.insert({ ...body, roles: JSON.stringify(body.roles) })
    return {
      body: res.raw
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('criteria-create', {
  methods: ['POST'],
  route: 'criteria',
  handler: (req, context) => JsonResWrapper(createCriteria(req, context))
})

import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, myvalidate, ResponseParams } from '../../lib/util'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  try {
    const dto = plainToClass(CreateCriteriaDTO, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        body: errors
      }
    }

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.insert({ ...dto, roles: JSON.stringify(dto.roles) })
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

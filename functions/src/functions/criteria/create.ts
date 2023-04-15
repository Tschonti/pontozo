import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { myvalidate } from '../../util/validation'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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
        jsonBody: errors
      }
    }

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.insert({ ...dto, roles: JSON.stringify(dto.roles) })
    return {
      jsonBody: res
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
  handler: createCriteria
})

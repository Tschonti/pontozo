import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const updateCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
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
    const res = await criterionRepo.update({ id }, { ...dto, roles: JSON.stringify(dto.roles) })
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

app.http('criteria-update', {
  methods: ['PUT'],
  route: 'criteria/{id}',
  handler: updateCriteria
})

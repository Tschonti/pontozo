import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import Criterion from '../../lib/typeorm/entities/Criterion'
import { getAppDataSource } from '../../lib/typeorm/getConfig'
import { JsonResWrapper, myvalidate, ResponseParams } from '../../lib/util'
import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const updateCriteria = async (req: HttpRequest, context: InvocationContext): Promise<ResponseParams> => {
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
        body: errors
      }
    }

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.update({ id }, { ...dto, roles: JSON.stringify(dto.roles) })
    return {
      body: res
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
  handler: (req, context) => JsonResWrapper(updateCriteria(req, context))
})

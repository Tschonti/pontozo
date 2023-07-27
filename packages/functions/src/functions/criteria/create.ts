import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { validateWithWhitelist } from '../../util/validation'
import { CreateCriteria, RatingRole } from '@pontozo/common'
// import { CreateCriteriaDTO } from './types/createCriteria.dto'

export const createCriteria = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.',
    }
  }
  try {
    const dto = plainToClass(CreateCriteria, await req.json())
    const errors = await validateWithWhitelist(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors,
      }
    }

    if (
      (dto.roles.includes(RatingRole.COMPETITOR) && !dto.competitorWeight) ||
      (dto.roles.includes(RatingRole.ORGANISER) && !dto.organiserWeight)
    ) {
      return {
        status: 400,
        body: 'Weight has to be specified for the roles!',
      }
    }

    const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
    const res = await criterionRepo.insert({ ...dto, roles: JSON.stringify(dto.roles) })
    return {
      jsonBody: res,
      status: 201,
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e,
    }
  }
}

app.http('criteria-create', {
  methods: ['POST'],
  route: 'criteria',
  handler: createCriteria,
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { getUserById } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateURADTO } from './types/CreateURA.dto'

export const createURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
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

  const dto = plainToClass(CreateURADTO, await req.json())
  const errors = await myvalidate(dto)
  if (errors.length > 0) {
    return {
      status: 400,
      jsonBody: errors
    }
  }

  const userQueryRes = await getUserById(dto.userId)
  if (userQueryRes.isError) {
    return httpResFromServiceRes(userQueryRes)
  }
  try {
    const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const res = await uraRepo.insert(dto)
    return {
      jsonBody: res.raw
    }
  } catch (e) {
    context.log(e)
    return {
      status: 500,
      body: e
    }
  }
}

app.http('uras-create', {
  methods: ['POST'],
  route: 'uras',
  handler: createURA
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { QueryFailedError } from 'typeorm'
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
  const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
  try {
    const res = await uraRepo.insert({
      ...dto,
      userFullName: `${userQueryRes.data.vezeteknev} ${userQueryRes.data.keresztnev}`,
      userDOB: userQueryRes.data.szul_dat
    })
    return {
      jsonBody: res.raw
    }
  } catch (e) {
    switch (e.constructor) {
      case QueryFailedError:
        if ((e as QueryFailedError).message.startsWith('Error: Violation of UNIQUE KEY constraint')) {
          return {
            status: 400,
            jsonBody: [
              {
                constraints: {
                  unique: 'Ez a személy már rendelkezik ezzel a szerepkörrel!'
                }
              }
            ]
          }
        }
    }
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

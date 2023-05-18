import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { QueryFailedError } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { getUserById } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { UpdateURADTO } from './types/UpdateURA.dto'

export const updateURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
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
    const dto = plainToClass(UpdateURADTO, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors
      }
    }

    const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const ura = await uraRepo.findOne({ where: { id } })
    const serviceRes = await getUserById(ura.userId)
    if (serviceRes.isError) {
      return httpResFromServiceRes(serviceRes)
    }
    ura.role = dto.role
    ura.userFullName = `${serviceRes.data.vezeteknev} ${serviceRes.data.keresztnev}`
    ura.userDOB = serviceRes.data.szul_dat

    return {
      jsonBody: await uraRepo.save(ura)
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

app.http('uras-update', {
  methods: ['PUT'],
  route: 'uras/{id}',
  handler: updateURA
})

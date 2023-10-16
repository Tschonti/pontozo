import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateURA, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { QueryFailedError } from 'typeorm'
import { getRedisClient } from '../../redis/redisClient'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { getUserById } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { validateBody, validateWithWhitelist } from '../../util/validation'

export const createURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const requesterUser = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const dto = plainToClass(CreateURA, await req.json())
    await validateWithWhitelist(dto)

    const user = await getUserById(dto.userId)
    const uraRepo = (await getAppDataSource(context)).getRepository(UserRoleAssignment)
    const res = await uraRepo.insert({
      ...dto,
      userFullName: `${user.vezeteknev} ${user.keresztnev}`,
      userDOB: user.szul_dat,
    })
    const createdURAId = res.identifiers[0].id
    const redisClient = await getRedisClient(context)
    await redisClient.hSet(`user:${dto.userId}`, createdURAId, dto.role)

    context.log(`User #${requesterUser.szemely_id} created URA #${res.identifiers[0].id} and saved it to Redis cache.`)
    return {
      jsonBody: res.raw,
    }
  } catch (e) {
    switch (e.constructor) {
      case QueryFailedError:
        if ((e as QueryFailedError).message.startsWith('Error: Violation of UNIQUE KEY constraint')) {
          return {
            status: 400,
            jsonBody: {
              statusCode: 400,
              message: 'Ez a személy már rendelkezik ezzel a szerepkörrel!',
            },
          }
        }
        break
      case PontozoException: {
        const error = e as PontozoException
        return {
          status: error.status,
          jsonBody: error.getError(),
        }
      }
    }
    context.log(e)
    return {
      status: 500,
      jsonBody: {
        statusCode: 500,
        message: 'Ismeretlen hiba!',
      },
    }
  }
}

app.http('uras-create', {
  methods: ['POST'],
  route: 'uras',
  handler: createURA,
})

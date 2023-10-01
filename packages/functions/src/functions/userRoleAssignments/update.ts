import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException, UpdateURA } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { QueryFailedError } from 'typeorm'
import { getRedisClient } from '../../redis/redisClient'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import { getUserById } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

export const updateURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const requesterUser = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const id = validateId(req)
    const dto = plainToClass(UpdateURA, await req.json())
    await validateWithWhitelist(dto)

    const uraRepo = (await getAppDataSource()).getRepository(UserRoleAssignment)
    const ura = await uraRepo.findOne({ where: { id } })
    const user = await getUserById(ura.userId)

    ura.role = dto.role
    ura.userFullName = `${user.vezeteknev} ${user.keresztnev}`
    ura.userDOB = user.szul_dat

    const redisClient = await getRedisClient(context)
    await redisClient.hSet(`user:${ura.userId}`, id, dto.role)

    context.log(`User #${requesterUser.szemely_id} created URA #${ura.id}`)
    return {
      jsonBody: await uraRepo.save(ura),
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

app.http('uras-update', {
  methods: ['PUT'],
  route: 'uras/{id}',
  handler: updateURA,
})

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { getRedisClient } from '../../util/redisClient'
import { validateId } from '../../util/validation'

export const deleteURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)

    const id = validateId(req)
    const [redisClient, ads] = await Promise.all([getRedisClient(context), getAppDataSource(context)])
    const uraRepo = ads.getRepository(UserRoleAssignment)
    const ura = await uraRepo.findOne({ where: { id } })
    if (ura) {
      await uraRepo.delete({ id })
      await redisClient.hDel(`user:${ura.userId}`, `${id}`)

      context.log(`User #${user.szemely_id} deleted URA #${id}`)
    }
    return {
      status: 204,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('uras-delete', {
  methods: ['DELETE'],
  route: 'uras/{id}',
  handler: deleteURA,
})

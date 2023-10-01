import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getRedisClient } from '../../redis/redisClient'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateId } from '../../util/validation'

export const deleteURA = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)

    const id = validateId(req)
    const [redisClient, ads] = await Promise.all([getRedisClient(context), getAppDataSource()])
    const uraRepo = ads.getRepository(UserRoleAssignment)
    const ura = await uraRepo.findOne({ where: { id } })
    const res = await uraRepo.delete({ id })
    await redisClient.hDel(`user:${ura.userId}`, `${id}`)

    context.log(`User #${user.szemely_id} deleted URA #${id}`)
    return {
      jsonBody: res,
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

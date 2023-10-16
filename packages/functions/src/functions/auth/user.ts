import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { DbUser } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'

export const currentUser = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)
    const roles = await (await getAppDataSource(context)).getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })
    return {
      jsonBody: { ...user, roles: roles.map((r) => r.role) } as DbUser,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('auth-user', {
  methods: ['GET'],
  route: 'auth/user',
  handler: currentUser,
})

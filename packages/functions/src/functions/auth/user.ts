import { app, HttpRequest, InvocationContext } from '@azure/functions'
import { DbUser } from '@pontozo/common'
import { getUserFromHeader } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { PontozoResponse } from '../../util/pontozoResponse'

export const currentUser = async (req: HttpRequest, context: InvocationContext): Promise<PontozoResponse<DbUser>> => {
  try {
    const user = getUserFromHeader(req)
    const roles = await (await getAppDataSource(context)).getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })
    return {
      jsonBody: { ...user, roles: roles.map((r) => r.role) },
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

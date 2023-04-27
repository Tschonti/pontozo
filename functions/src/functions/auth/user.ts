import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { PontozoUser } from './types/PontozoUser'

export const currentUser = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const { isError, status, message, userFromJwt: user } = getUserFromHeader(req)
    if (isError) {
      return {
        status: status,
        body: message
      }
    }

    const roles = await (await getAppDataSource()).getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })

    return {
      jsonBody: { ...user, roles: roles.map((r) => r.role) } as PontozoUser
    }
  } catch (e) {
    return {
      status: 401,
      jsonBody: e
    }
  }
}

app.http('auth-user', {
  methods: ['GET'],
  route: 'auth/user',
  handler: currentUser
})

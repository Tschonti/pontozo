import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeader } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { PontozoUser } from './types/PontozoUser'

export const currentUser = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const userServiceRes = getUserFromHeader(req)
  if (userServiceRes.isError) {
    return httpResFromServiceRes(userServiceRes)
  }
  try {
    const roles = await (await getAppDataSource())
      .getRepository(UserRoleAssignment)
      .find({ where: { userId: userServiceRes.data.szemely_id } })

    return {
      jsonBody: { ...userServiceRes.data, roles: roles.map((r) => r.role) } as PontozoUser
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

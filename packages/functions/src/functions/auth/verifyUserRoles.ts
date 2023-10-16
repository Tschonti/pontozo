import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { getUserFromHeader } from '../../service/auth.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { JWT_SECRET } from '../../util/env'
import { handleException } from '../../util/handleException'

export const verifyUserRoles = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = getUserFromHeader(req)
    const ads = await getAppDataSource(context)

    const roles = (await ads.getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })).map((r) => r.role)
    const jwtToken = jwt.sign({ ...user, roles }, JWT_SECRET, { expiresIn: '2 days' })
    context.log(`User #${user.szemely_id} verified their user roles`)
    return {
      jsonBody: {
        token: jwtToken,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('auth-verify', {
  methods: ['GET'],
  route: 'auth/verify',
  handler: verifyUserRoles,
})

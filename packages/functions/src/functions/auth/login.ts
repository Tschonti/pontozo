import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { PontozoException } from '../../../../common/src'
import { getToken, getUser } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { FRONTEND_URL, JWT_SECRET } from '../../util/env'
import { handleException } from '../../util/handleException'

export const login = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const authorizationCode = req.query.get('code')
    if (!authorizationCode) {
      throw new PontozoException('Nem sikerült az autentikáció!', 401)
    }

    const oauthToken = await getToken(authorizationCode)
    const user = await getUser(oauthToken.access_token)

    const roles = await (await getAppDataSource()).getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })
    const jwtToken = jwt.sign({ ...user, roles: roles.map((r) => r.role) }, JWT_SECRET, { expiresIn: '2 days' })
    return {
      status: 302,
      headers: {
        location: `${FRONTEND_URL}/authorized?token=${jwtToken}`,
      },
    }
  } catch (error) {
    handleException(context, error)
  }
}

app.http('auth-login', {
  methods: ['GET'],
  route: 'auth/callback',
  handler: login,
})

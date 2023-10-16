import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { PontozoException } from '@pontozo/common'
import * as jwt from 'jsonwebtoken'
import { DataSource } from 'typeorm'
import { getRedisClient } from '../../redis/redisClient'
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
    const dataSource = await Promise.race([getAppDataSource(context), getRedisClient(context)])

    let roles = []
    if (dataSource instanceof DataSource) {
      context.log('Logging in from DB')
      roles = (await dataSource.getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })).map((r) => r.role)
    } else {
      context.log('Logging in from cache')
      const rawRoles = await dataSource.hGetAll(`ura:${user.szemely_id}`)
      roles = rawRoles ? Object.values(rawRoles) : []
    }

    const jwtToken = jwt.sign({ ...user, roles }, JWT_SECRET, { expiresIn: '2 days' })
    context.log(`User #${user.szemely_id} signed in`)
    return {
      status: 302,
      headers: {
        location: `${FRONTEND_URL}/authorized?token=${jwtToken}`,
      },
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('auth-login', {
  methods: ['GET'],
  route: 'auth/callback',
  handler: login,
})

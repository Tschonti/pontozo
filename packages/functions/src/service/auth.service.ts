import { HttpRequest, InvocationContext } from '@azure/functions'
import { DbUser, PontozoException, UserRole } from '@pontozo/common'
import * as jwt from 'jsonwebtoken'
import UserRoleAssignment from '../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../typeorm/getConfig'
import { JWT_SECRET } from '../util/env'

export const getUserFromHeader = (req: HttpRequest): DbUser => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new PontozoException('Nem vagy bejelentkezve!', 401)
  }
  const jwtToken = authHeader.replace('Bearer', '').trim()
  try {
    const { iat, exp, ...userFromJwt } = jwt.verify(jwtToken, JWT_SECRET) as DbUser & { iat: number; exp: number }
    return userFromJwt
  } catch (error) {
    throw new PontozoException('Érvénytelen JWT token!', 401)
  }
}

export const getUserFromHeaderAndAssertAdmin = async (req: HttpRequest, context: InvocationContext): Promise<DbUser> => {
  const user = getUserFromHeader(req)
  context.log(`User #${user.szemely_id} attempting to access entity reserved for admins`)
  const ura = await (await getAppDataSource(context))
    .getRepository(UserRoleAssignment)
    .findOne({ where: { userId: user.szemely_id, role: UserRole.SITE_ADMIN } })
  if (!ura) {
    throw new PontozoException('Nem vagy jogosult ennek a műveletnek a végrehajtásához!', 403)
  }
  return user
}

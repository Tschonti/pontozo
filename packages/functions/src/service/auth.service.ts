import { HttpRequest } from '@azure/functions'
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
    const userFromJwt = jwt.verify(jwtToken, JWT_SECRET) as DbUser
    return userFromJwt
  } catch (error) {
    throw new PontozoException('Érvénytelen JWT token!', 401)
  }
}

export const getUserFromHeaderAndAssertAdmin = async (req: HttpRequest): Promise<void> => {
  const user = getUserFromHeader(req)
  const ura = await (await getAppDataSource())
    .getRepository(UserRoleAssignment)
    .findOne({ where: { userId: user.szemely_id, role: UserRole.SITE_ADMIN } })
  if (!ura) {
    throw new PontozoException('Nem vagy jogosult ennek a műveletnek a végrehajtásához!', 403)
  }
}

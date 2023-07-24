import { HttpRequest } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import UserRoleAssignment from '../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../typeorm/getConfig'
import { JWT_SECRET } from '../util/env'
import { DbUser, ServiceResponse, UserRole } from '@pontozo/types'

export const getUserFromHeader = (req: HttpRequest): ServiceResponse<DbUser> => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return {
      isError: true,
      status: 401,
      message: 'Unauthorized',
    }
  }
  const jwtToken = authHeader.replace('Bearer', '').trim()

  try {
    const userFromJwt = jwt.verify(jwtToken, JWT_SECRET) as DbUser

    return {
      isError: false,
      data: userFromJwt,
    }
  } catch (error) {
    return {
      isError: true,
      status: 401,
      message: `Unauthorized - invalid jwt`,
    }
  }
}

export const getUserFromHeaderAndAssertAdmin = async (req: HttpRequest): Promise<ServiceResponse<never>> => {
  const { data: user, ...userRes } = getUserFromHeader(req)
  if (userRes.isError) {
    return userRes
  }
  const ura = await (await getAppDataSource())
    .getRepository(UserRoleAssignment)
    .findOne({ where: { userId: user.szemely_id, role: UserRole.SITE_ADMIN } })
  if (ura) {
    return {
      isError: false,
    }
  }
  return {
    isError: true,
    message: "You're not allowed to perform this action!",
    status: 403,
  }
}

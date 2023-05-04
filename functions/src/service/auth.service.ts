import { HttpRequest } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { PontozoUser } from '../functions/auth/types/PontozoUser'
import { UserRole } from '../typeorm/entities/UserRoleAssignment'
import { JWT_SECRET } from '../util/env'
import { ServiceResponse } from './types'

export const getUserFromHeader = (req: HttpRequest): ServiceResponse<PontozoUser> => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return {
      isError: true,
      status: 401,
      message: 'Unauthorized'
    }
  }
  const jwtToken = authHeader.replace('Bearer', '').trim()

  try {
    const userFromJwt = jwt.verify(jwtToken, JWT_SECRET) as PontozoUser

    return {
      isError: false,
      data: userFromJwt
    }
  } catch (error) {
    return {
      isError: true,
      status: 401,
      message: `Unauthorized - invalid jwt`
    }
  }
}

export const getUserFromHeaderAndAssertAdmin = (req: HttpRequest): ServiceResponse<never> => {
  const { data: user, ...userRes } = getUserFromHeader(req)
  if (userRes.isError) {
    return userRes
  }
  if (user.roles.includes(UserRole.SITE_ADMIN)) {
    return {
      isError: false
    }
  }
  return {
    isError: true,
    message: "You're not allowed to perform this action!",
    status: 403
  }
}

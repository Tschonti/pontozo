import { HttpRequest } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { PontozoUser } from '../functions/auth/types/PontozoUser'
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

import { HttpRequest } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { PontozoUser } from '../functions/auth/types/PontozoUser'
import { JWT_SECRET } from '../util/env'

export interface AuthorizationResponse {
  isError: boolean
  userFromJwt?: PontozoUser
  status?: number
  message?: string
}

export const getUserFromHeader = (req: HttpRequest): AuthorizationResponse => {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    console.log('no auth header')
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
      userFromJwt
    }
  } catch (error) {
    console.log(error)
    return {
      isError: true,
      status: 401,
      message: `Unauthorized - invalid jwt`
    }
  }
}

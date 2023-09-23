import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { DbUser, PontozoError, PontozoException } from '@pontozo/common'
import { getUserFromHeader } from '../service/auth.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleException = (req: HttpRequest, context: InvocationContext, error: any): HttpResponseInit => {
  let user: DbUser
  try {
    user = getUserFromHeader(req)
  } catch {
    user = null
  }
  if (error instanceof PontozoException) {
    if (user) {
      context.log(`User #${user.szemely_id} encountered the following normal error: ${JSON.stringify(error.getError())}`)
    } else {
      context.log(`Unauthorized user encountered the following normal error: ${JSON.stringify(error.getError())}`)
    }
    return {
      status: error.status,
      jsonBody: error.getError(),
    }
  }
  if (user) {
    context.error(`User #${user.szemely_id} encountered the following unexpected error: ${error}`)
  } else {
    context.error(`Unauthorized user encountered the following unexpected error: ${error}`)
  }
  return {
    status: 500,
    jsonBody: { statusCode: 500, message: 'Ismeretlen hiba' } as PontozoError,
  }
}

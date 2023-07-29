import { InvocationContext } from '@azure/functions'
import { PontozoError, PontozoException } from '@pontozo/common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleException = (context: InvocationContext, error: any) => {
  if (error instanceof PontozoException) {
    return {
      status: error.status,
      jsonBody: error.getError(),
    }
  }
  context.error(error)
  return {
    status: 500,
    jsonBody: { statusCode: 500, message: 'Ismeretlen hiba' } as PontozoError,
  }
}

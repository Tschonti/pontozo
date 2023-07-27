import { HttpResponseInit } from '@azure/functions'
import { ServiceResponse } from '@pontozo/common'

export const httpResFromServiceRes = (serRes: ServiceResponse<unknown>): HttpResponseInit => ({
  status: serRes.status,
  body: serRes.message,
})

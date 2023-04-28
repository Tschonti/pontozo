import { HttpResponseInit } from '@azure/functions'
import { ServiceResponse } from '../service/types'

export const httpResServiceRes = (serRes: ServiceResponse<unknown>): HttpResponseInit => ({
  status: serRes.status,
  body: serRes.message
})

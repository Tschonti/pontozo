import { HttpResponseInit } from '@azure/functions'
import { ServiceResponse } from '../service/types'

export const httpResFromServiceRes = (serRes: ServiceResponse<unknown>): HttpResponseInit => ({
  status: serRes.status,
  body: serRes.message
})

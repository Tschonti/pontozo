import { HttpResponseInit } from '@azure/functions'

export type PontozoResponse<T> = HttpResponseInit & {
  jsonBody?: T
}

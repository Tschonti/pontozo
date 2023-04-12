import { HttpResponseInit } from '@azure/functions'

export type ResponseParams = {
  body?: any
  status?: number
  headers?: object
}

export const JsonResWrapper = async (p: Promise<ResponseParams>): Promise<HttpResponseInit> => {
  return genJsonRes(await p)
}

export const genJsonRes = ({ body, status, headers }: ResponseParams): HttpResponseInit => ({
  body: JSON.stringify(body),
  status,
  headers: {
    'Content-Type': 'application/json',
    ...headers
  }
})

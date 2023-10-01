export type CreateResponse = {
  id: number
}

export type EntityWithEditableIndicator<T> = T & {
  editable: boolean
}

export type MtfszFetchResult<T> = {
  result: T[]
  page_size: number
}

export type AuthToken = {
  token: string
}

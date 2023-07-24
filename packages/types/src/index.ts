export * from './lib/mtfszEvents'
export * from './lib/criteria'
export * from './lib/categories'
export * from './lib/criterionRatings'
export * from './lib/dbEvents'
export * from './lib/criterionRatings'
export * from './lib/eventRatings'
export * from './lib/seasons'
export * from './lib/uras'
export * from './lib/users'

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

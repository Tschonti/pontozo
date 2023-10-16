import { InvocationContext } from '@azure/functions'
import { DataSource } from 'typeorm'
import { DB_ADMIN_PWD, DB_ADMIN_USER } from '../util/env'
import { DBConfig } from './configOptions'

export const getAppDataSource = async (context: InvocationContext) => {
  const ads = new DataSource(DBConfig)
  try {
    return await ads.initialize()
  } catch (e) {
    context.warn('Connection to DB failed, retrying...', e)
    return await ads.initialize()
  }
}

export const getAdminDataSource = async () => {
  const ads = new DataSource({ ...DBConfig, username: DB_ADMIN_USER, password: DB_ADMIN_PWD })
  return await ads.initialize()
}

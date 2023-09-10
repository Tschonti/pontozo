import { DataSource } from 'typeorm'
import { DB_ADMIN_PWD, DB_ADMIN_USER } from '../util/env'
import { DBConfig } from './configOptions'

export const getAppDataSource = async () => {
  const ads = new DataSource(DBConfig)
  return await ads.initialize()
}

export const getAdminDataSource = async () => {
  const ads = new DataSource({ ...DBConfig, username: DB_ADMIN_USER, password: DB_ADMIN_PWD })
  return await ads.initialize()
}

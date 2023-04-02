import { DataSource } from 'typeorm'
import { DBConfig } from './configOptions'

export const getAppDataSource = async () => {
  const ads = new DataSource(DBConfig)
  return await ads.initialize()
}

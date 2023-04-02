import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { DBConfig } from './configOptions'

const ads = new DataSource(DBConfig)

export default ads

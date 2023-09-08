import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { DB_ADMIN_PWD, DB_ADMIN_USER } from '../util/env'
import { DBConfig } from './configOptions'

const ads = new DataSource({ ...DBConfig, username: DB_ADMIN_USER, password: DB_ADMIN_PWD })

export default ads

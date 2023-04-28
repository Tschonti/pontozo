import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from '../util/env'
import Category from './entities/Category'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import Season from './entities/Season'
import UserRoleAssignment from './entities/UserRoleAssignment'
import { Redo1682690490190 } from './migrations/1682690490190-redo'

export const DBConfig: DataSourceOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Criterion, CriterionRating, EventRating, Category, Season, UserRoleAssignment],
  subscribers: [],
  migrations: [Redo1682690490190],
  options: { encrypt: ENCRYPT }
}

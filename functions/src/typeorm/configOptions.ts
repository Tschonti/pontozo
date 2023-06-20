import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT, ENV } from '../util/env'
import Category from './entities/Category'
import { CategoryToCriterion } from './entities/CategoryToCriterion'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import Season from './entities/Season'
import { SeasonToCategory } from './entities/SeasonToCategory'
import UserRoleAssignment from './entities/UserRoleAssignment'
import { Init1687282895144 } from './migrations/1687282895144-init'

export const DBConfig: DataSourceOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: !(ENV === 'production'),
  connectionTimeout: 60000,
  entities: [Criterion, CriterionRating, EventRating, Category, Season, UserRoleAssignment, CategoryToCriterion, SeasonToCategory],
  subscribers: [],
  migrations: [Init1687282895144],
  options: { encrypt: ENCRYPT }
}

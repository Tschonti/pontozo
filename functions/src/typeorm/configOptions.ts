import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from '../util/env'
import Category from './entities/Category'
import { CategoryToCriterion } from './entities/CategoryToCriterion'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import Season from './entities/Season'
import UserRoleAssignment from './entities/UserRoleAssignment'
import { Redo1683278631422 } from './migrations/1683278631422-redo'
import { Redo21683280435325 } from './migrations/1683280435325-redo2'

export const DBConfig: DataSourceOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Criterion, CriterionRating, EventRating, Category, Season, UserRoleAssignment, CategoryToCriterion],
  subscribers: [],
  migrations: [Redo1683278631422, Redo21683280435325],
  options: { encrypt: ENCRYPT }
}

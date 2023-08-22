import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT, ENV } from '../util/env'
import Category from './entities/Category'
import { CategoryToCriterion } from './entities/CategoryToCriterion'
import Club from './entities/Club'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import Event from './entities/Event'
import EventRating from './entities/EventRating'
import Season from './entities/Season'
import SeasonCriterionCount from './entities/SeasonCriterionCount'
import { SeasonToCategory } from './entities/SeasonToCategory'
import Stage from './entities/Stage'
import UserRoleAssignment from './entities/UserRoleAssignment'
import { Init1691784848264 } from './migrations/1691784848264-init'
import { RatingState1692730361523 } from './migrations/1692730361523-ratingState'

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
  entities: [
    Criterion,
    CriterionRating,
    EventRating,
    Category,
    Season,
    UserRoleAssignment,
    CategoryToCriterion,
    SeasonToCategory,
    Event,
    Stage,
    Club,
    SeasonCriterionCount,
  ],
  subscribers: [],
  migrations: [Init1691784848264, RatingState1692730361523],
  options: { encrypt: ENCRYPT },
}

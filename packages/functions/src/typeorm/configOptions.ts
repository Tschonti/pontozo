import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'
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
import { Init1694205775872 } from './migrations/1694205775872-init'
import { AddRaterAge1695666298049 } from './migrations/1695666298049-add_rater_age'
import { UniqueEventForUser1696272553417 } from './migrations/1696272553417-unique_event_for_user'
import { MessageToRating1705141629515 } from './migrations/1705141629515-message_to_rating'

export const DBConfig: SqlServerConnectionOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: !(ENV === 'production'),
  connectionTimeout: 120000,
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
  migrations: [Init1694205775872, AddRaterAge1695666298049, UniqueEventForUser1696272553417, MessageToRating1705141629515],
  options: { encrypt: ENCRYPT },
}

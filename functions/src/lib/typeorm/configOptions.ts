import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from '../env'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import { init1679948629543 } from './migrations/1679948629543-init'
import { rating1679949145989 } from './migrations/1679949145989-rating'
import { eventRating1680440204162 } from './migrations/1680440204162-event_rating'
import { rolesToCriterion1680440941456 } from './migrations/1680440941456-roles_to_criterion'
import { criterionUnique1680813090149 } from './migrations/1680813090149-criterion_unique'

export const DBConfig: DataSourceOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Criterion, CriterionRating, EventRating],
  subscribers: [],
  migrations: [
    init1679948629543,
    rating1679949145989,
    eventRating1680440204162,
    rolesToCriterion1680440941456,
    criterionUnique1680813090149
  ],
  options: { encrypt: ENCRYPT }
}

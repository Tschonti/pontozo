import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from '../util/env'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import { Redo1681640128728 } from './migrations/1681640128728-redo'
import { StageIdUnique1681660884575 } from './migrations/1681660884575-stageIdUnique'

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
  migrations: [Redo1681640128728, StageIdUnique1681660884575],
  options: { encrypt: ENCRYPT }
}

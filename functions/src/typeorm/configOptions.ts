import { DataSourceOptions } from 'typeorm'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from '../util/env'
import Category from './entities/Category'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import EventRating from './entities/EventRating'
import Season from './entities/Season'
import { Redo1681640128728 } from './migrations/1681640128728-redo'
import { StageIdUnique1681660884575 } from './migrations/1681660884575-stageIdUnique'
import { SeasonForReal1682357692358 } from './migrations/1682357692358-seasonForReal'
import { DropDescSeason1682361305950 } from './migrations/1682361305950-dropDescSeason'

export const DBConfig: DataSourceOptions = {
  type: 'mssql',
  host: DB_SERVER,
  port: 1433,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Criterion, CriterionRating, EventRating, Category, Season],
  subscribers: [],
  migrations: [Redo1681640128728, StageIdUnique1681660884575, SeasonForReal1682357692358, DropDescSeason1682361305950],
  options: { encrypt: ENCRYPT }
}

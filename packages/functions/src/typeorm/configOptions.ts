import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT, ENV } from '../util/env'
import Alert from './entities/Alert'
import Category from './entities/Category'
import { CategoryToCriterion } from './entities/CategoryToCriterion'
import Club from './entities/Club'
import Criterion from './entities/Criterion'
import CriterionRating from './entities/CriterionRating'
import { CriterionWeight } from './entities/CriterionWeight'
import Event from './entities/Event'
import EventRating from './entities/EventRating'
import { RatingResult } from './entities/RatingResult'
import Season from './entities/Season'
import SeasonCriterionCount from './entities/SeasonCriterionCount'
import { SeasonToCategory } from './entities/SeasonToCategory'
import Stage from './entities/Stage'
import UserRoleAssignment from './entities/UserRoleAssignment'
import { Init1694205775872 } from './migrations/1694205775872-init'
import { AddRaterAge1695666298049 } from './migrations/1695666298049-add_rater_age'
import { UniqueEventForUser1696272553417 } from './migrations/1696272553417-unique_event_for_user'
import { MessageToRating1705141629515 } from './migrations/1705141629515-message_to_rating'
import { AddRatingResult1705251815793 } from './migrations/1705251815793-add_rating_result'
import { RatingResultItemsText1705347424162 } from './migrations/1705347424162-rating_result_items_text'
import { EventState1705779906213 } from './migrations/1705779906213-event_state'
import { AddInvalidatedState1711307184824 } from './migrations/1711307184824-add_invalidated_state'
import { AddAlertTable1711394423616 } from './migrations/1711394423616-add_alert_table'
import { RatingMessageTextType1728838819007 } from './migrations/1728838819007-rating_message_text_type'
import { CriteriaWeightTable1735297080260 } from './migrations/1735297080260-criteria-weight-table'

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
    Alert,
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
    RatingResult,
    CriterionWeight,
  ],
  subscribers: [],
  migrations: [
    Init1694205775872,
    AddRaterAge1695666298049,
    UniqueEventForUser1696272553417,
    MessageToRating1705141629515,
    AddRatingResult1705251815793,
    RatingResultItemsText1705347424162,
    EventState1705779906213,
    AddInvalidatedState1711307184824,
    AddAlertTable1711394423616,
    RatingMessageTextType1728838819007,
    CriteriaWeightTable1735297080260,
  ],
  options: { encrypt: ENCRYPT },
}

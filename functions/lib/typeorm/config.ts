import "reflect-metadata"
import { DataSource } from "typeorm"
import { DB_NAME, DB_PWD, DB_SERVER, DB_USER, ENCRYPT } from "../env"
import Criterion from "./entities/Criterion"
import Rating from "./entities/Rating"
import { init1679948629543 } from "./migrations/1679948629543-init"
import { rating1679949145989 } from "./migrations/1679949145989-rating"

export const AppDataSource = new DataSource({
    type: "mssql",
    host: DB_SERVER,
    port: 1433,
    username: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Criterion, Rating],
    subscribers: [],
    migrations: [init1679948629543, rating1679949145989],
    options: {encrypt: ENCRYPT},
})

AppDataSource.initialize()

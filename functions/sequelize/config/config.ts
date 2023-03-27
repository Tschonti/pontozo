import { Sequelize } from "sequelize";

const seq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, { dialect: 'mssql', host: process.env.DB_SERVER })
export default seq
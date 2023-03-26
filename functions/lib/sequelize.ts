import { Sequelize } from "sequelize";

const seq = new Sequelize(process.env.DATABASE_URL)

export default seq
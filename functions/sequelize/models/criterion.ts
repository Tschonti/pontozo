import { DataTypes, Model } from "sequelize";
import seq from "../config";

export class Criterion extends Model {}

Criterion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    minValue: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    maxValue: {
        type: DataTypes.INTEGER,
        defaultValue: 3
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize: seq, modelName: 'Criterion', tableName: 'Criteria'})
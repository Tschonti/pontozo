import { DataTypes, Model } from "sequelize";
import seq from "./config";

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
        allowNull: false,
    },
    maxValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize: seq, modelName: 'Criterion', tableName: 'Criteria', validate: {
    maxBiggerThanMin() {
        if (this.minValue >= this.maxValue) {
            throw new Error("minValue must be smaller than maxValue!")
        }
    }
}})

export class Rating extends Model {}

Rating.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    }
}, {sequelize: seq, modelName: 'Rating', validate: {
    async validateForeignKey() {
        const criterion = await Criterion.findByPk(this.criterionId)
        if (!criterion) {
            throw new Error("Non-existent criterion!")
        }
    }
}})

Criterion.hasMany(Rating, {foreignKey: {allowNull: false, name: 'criterionId'}, onDelete: 'CASCADE'})
Rating.belongsTo(Criterion, {foreignKey: {allowNull: false, name: 'criterionId'}, onDelete: 'CASCADE'})
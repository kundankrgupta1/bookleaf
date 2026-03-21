import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { ROLE } from "../constant/constant.js";

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: true
        },

        joined_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM(ROLE),
            allowNull: false
        }
    },
    {
        tableName: 'users',
        modelName: 'User',
        timestamps: true,
        underscored: true,
    }
);

export default User;

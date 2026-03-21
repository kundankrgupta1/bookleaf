import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { ROLE } from "../constant/constant.js";

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        ticket_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        sender_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        sender_role: {
            type: DataTypes.ENUM(ROLE),
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        attachments: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "messages",
        modelName: "Message",
        timestamps: true,
        underscored: true
    }
);

export default Message;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { CATEGORIES, PRIORITY, TICKET_STATUS } from "../constant/constant.js";

const Ticket = sequelize.define(
    'Ticket',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        book_id: {
            type: DataTypes.UUID,
            allowNull: true
        },

        ticket_number: {
            type: DataTypes.STRING,
            allowNull: false
        },

        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        category: {
            type: DataTypes.ENUM(CATEGORIES),
            allowNull: true,
        },

        priority: {
            type: DataTypes.ENUM(PRIORITY),
            defaultValue: 'MEDIUM'
        },

        status: {
            type: DataTypes.ENUM(TICKET_STATUS),
            defaultValue: 'OPEN'
        },

        assigned_to: {
            type: DataTypes.UUID,
            allowNull: true
        },

        is_internal_note: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        internal_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        internal_notes_creator: {
            type: DataTypes.UUID,
            allowNull: true
        }
    },
    {
        tableName: 'tickets',
        modelName: 'Ticket',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['status'] },
            { fields: ['priority'] }
        ]
    }
)

export default Ticket;

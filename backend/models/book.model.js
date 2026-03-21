import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";
import { BOOK_STATUS, LANGUAGE, PRINT_PARTNER } from "../constant/constant.js";

const Book = sequelize.define(
    "Book",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        author_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        manuscript_file: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        genre: {
            type: DataTypes.JSONB,
            allowNull: false,
        },

        language: {
            type: DataTypes.ENUM(LANGUAGE),
            allowNull: false
        },

        cover: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        publication_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(BOOK_STATUS),
            defaultValue: 'EDITING',
        },

        mrp: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },

        author_royalty_per_copy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        total_copies_sold: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        total_royalty_earned: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },

        royalty_paid: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },

        royalty_pending: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },

        last_royalty_payout_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        print_partner: {
            type: DataTypes.ENUM(PRINT_PARTNER),
            allowNull: true,
        },

        available_on: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        tableName: "books",
        modelName: 'Book',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['author_id', 'title'] }
        ]
    }
);

export default Book;
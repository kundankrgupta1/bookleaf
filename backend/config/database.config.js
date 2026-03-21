import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { config } from "../config/service.config.js";

const sequelize = new Sequelize(
    config.postgresql.name,
    config.postgresql.user,
    config.postgresql.password,
    {
        host: config.postgresql.host,
        port: config.postgresql.port,
        dialect: "postgres",

        logging: false,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true,
                ca: fs.readFileSync(
                    path.resolve("./public/certificate.crt")
                ).toString()
            }
        },

        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        retry: {
            max: 5,
            backoffBase: 100,
            backoffExponent: 2,
            match: [
                Sequelize.ConnectionError,
                Sequelize.ConnectionRefusedError,
                Sequelize.ConnectionTimedOutError,
                Sequelize.HostNotReachableError,
                Sequelize.InvalidConnectionError,
            ],
        },
    }
);

export const connectDatabase = async (retries = 3) => {
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log("✅ PostgreSQL connected via Sequelize");
            // await sequelize.sync({ alter: true });
            return;
        } catch (error) {
            console.error(`❌ Database connection failed: etries left: ${retries - 1}, ${error.message}`);
            retries -= 1;
            if (!retries) {
                console.error("🐞 Exhausted all retries. Exiting...");
                process.exit(1);
            }
            console.log("🔄 Retrying database connection in 3 seconds...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }
};

export default sequelize;
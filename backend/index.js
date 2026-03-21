import "./scripts/loadVariables.js";

import http from "http";
import { startApp } from "./app/app.js";
import { connectDatabase } from "./config/database.config.js";
import { config } from "./config/service.config.js";
import { initSocket } from "./sockets/socket.js";

const bootstrap = async () => {
    try {

        await connectDatabase();
        console.info(`[Startup]: Database connected`);

        const app = startApp();

        const server = http.createServer(app);

        const io = initSocket(server);

        app.set("io", io);

        server.listen(config.port, () => {
            console.info(
                `[Server Running]: ${config.applicationName} running at http://${config.host}:${config.port}`
            );
        });

        const shutdown = (signal) => {
            console.warn(`[Shutdown]: Received ${signal}. Closing server...`);
            server.close(() => {
                console.info("[Shutdown]: Server closed");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error(`[Fatal Error]: ${error.message}`);
        process.exit(1);
    }
};

process.on("unhandledRejection", (reason) => {
    console.error("[Unhandled Rejection]:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("[Uncaught Exception]:", error.message);
    process.exit(1);
});

bootstrap();
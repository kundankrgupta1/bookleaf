import express from "express";
import router from "../routes/index.routes.js";
import { globalErrorHandler } from "../middlewares/errorHandler.middleware.js";
import cors from "cors";

export const startApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", router);

    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "OK" });
    });

    app.use(globalErrorHandler);

    return app;
};
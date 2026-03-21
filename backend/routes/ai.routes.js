import express from "express";
import { generateResponse } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { roleGuardMiddleware } from "../middlewares/roleGuard.middleware.js";

const router = express.Router();

router.post(
    "/:ticketId/draft",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    generateResponse
);

export default router;

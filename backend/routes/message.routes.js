import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post(
    "/:ticketId/send",
    authMiddleware,
    sendMessage
);

router.get(
    "/:ticketId/messages",
    authMiddleware,
    getMessages
);

export default router;

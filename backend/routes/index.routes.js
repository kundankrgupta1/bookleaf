import express from "express";
import bookRoutes from "../routes/book.routes.js";
import messageRoutes from "../routes/message.routes.js";
import ticketRoutes from "../routes/ticket.routes.js";
import userRoutes from "../routes/user.routes.js";
import aiRoutes from "../routes/ai.routes.js";

const router = express.Router();

router.use("/book", bookRoutes);
router.use("/message", messageRoutes);
router.use("/ticket", ticketRoutes);
router.use("/user", userRoutes);
router.use("/ai", aiRoutes);

export default router;

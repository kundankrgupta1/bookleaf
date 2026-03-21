import express from "express";
import { assignTicket, createInternalNotes, createTicket, getAllTickets, getAssignedTickets, getTicket, updateTicket } from "../controllers/ticket.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { roleGuardMiddleware } from "../middlewares/roleGuard.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleGuardMiddleware('AUTHOR'),
    createTicket
);

router.get(
    "/",
    authMiddleware,
    getAllTickets
);

router.patch(
    "/assign/:ticketId",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    assignTicket
);

router.patch(
    "/notes/:ticketId",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    createInternalNotes
);

router.get(
    "/:ticketId",
    authMiddleware,
    getTicket
);

router.get(
    "/assigned-tickets",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    getAssignedTickets
);

router.put(
    "/update/:ticketId",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    updateTicket
)

export default router;

import express from "express";
import { getAdminsList, getUser, login, userRegistration } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { roleGuardMiddleware } from "../middlewares/roleGuard.middleware.js";

const router = express.Router();

router.post(
    "/register",
    userRegistration
);

router.post(
    "/login",
    login
);

router.get(
    "/list",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    getAdminsList
);

router.get(
    "/:userId",
    authMiddleware,
    getUser
);

export default router;

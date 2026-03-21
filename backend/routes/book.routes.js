import express from "express";
import { bookList, createBook, getAllBooks, getAuthorStatic, getBookById, updateBook } from "../controllers/book.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { roleGuardMiddleware } from "../middlewares/roleGuard.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleGuardMiddleware('AUTHOR'),
    createBook
);

router.get(
    "/",
    authMiddleware,
    getAllBooks
);

router.put(
    "/update/:bookId",
    authMiddleware,
    roleGuardMiddleware('ADMIN'),
    updateBook
);

router.get(
    "/state",
    authMiddleware,
    roleGuardMiddleware('AUTHOR'),
    getAuthorStatic
);

router.get(
    "/list",
    authMiddleware,
    roleGuardMiddleware('AUTHOR'),
    bookList
);

router.get(
    "/:bookId",
    authMiddleware,
    roleGuardMiddleware('AUTHOR'),
    getBookById
);

export default router;

import bookService from "../services/book.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBook = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const { title, genre = [], language, file } = req.body;

    const book = await bookService.createBook({
        title,
        genre,
        language,
        manuscript_file: file,
        author_id: userId
    });

    return res.status(200).json({
        success: true,
        message: "Book added successfully",
        book
    });
});

export const updateBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const updatedPayload = {};

    const allowedFields = ['isbn', 'cover', 'publication_date', 'status', 'mrp', 'author_royalty_per_copy', 'total_royalty_earned', 'royalty_paid', 'royalty_pending', 'last_royalty_payout_date', 'print_partner', 'available_on'];

    for (const key in req.body) {
        if (allowedFields.includes(key) && req.body[key] !== undefined && req.body[key] !== null) {
            updatedPayload[key] = req.body[key];
        }
    };

    const book = await bookService.updateBookStatus(bookId, updatedPayload);

    return res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book
    });
});

export const getAllBooks = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;

    const { page = 1, limit = 5, genre, language, publication_date } = req.query;

    const pageNum = Math.max(+page, 1);
    const limitNum = Math.max(+limit, 1);
    const offset = limitNum ? (pageNum - 1) * limitNum : 0;

    const where = {};
    if (role === 'AUTHOR') {
        where.author_id = userId
    };

    if (genre) {
        where.genre = genre;
    };

    if (language) {
        where.language = language;
    };

    if (publication_date) {
        where.publication_date = publication_date;
    };

    const books = await bookService.getAllBook(limitNum, offset, where);

    return res.status(200).json({
        success: true,
        message: 'Sucess',
        pagination: {
            page: pageNum,
            limit: limitNum,
            total: books?.count,
            totalPages: Math.ceil(books?.count / limitNum)
        },
        books: books?.books
    });
});

export const getBookById = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const book = await bookService.getBook(bookId)

    return res.status(200).json({
        success: true,
        message: "Success",
        book
    });
});

export const getAuthorStatic = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const states = await bookService.authorStatics(userId);

    return res.status(200).json({
        success: true,
        message: "Success",
        states
    });
});

export const bookList = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const books = await bookService.getBookList(userId);
    
    return res.status(200).json({
        success: true,
        message: 'Success',
        books
    })
});
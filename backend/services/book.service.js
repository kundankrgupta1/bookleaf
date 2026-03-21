import { col, fn, Op } from "sequelize";
import { Book, User } from "../models/index.model.js";
import { ApiError } from "../utils/ApiError.js";

class BookService {
    async createBook(payload) {
        try {
            const isExist = await Book.findOne({
                where: {
                    title: {
                        [Op.iLike]: `${payload?.title}`
                    },
                    author_id: payload.author_id
                }
            });

            console.log('first', isExist);

            if (isExist) {
                throw new ApiError(409, 'Book already exist');
            }

            const book = await Book.create(payload);

            return book;
        } catch (error) {
            throw error;
        }
    }

    async updateBookStatus(bookId, payload) {
        try {
            const isExist = await Book.findByPk(bookId);

            if (!isExist) {
                throw new ApiError(404, 'Book not found');
            }

            const book = await isExist.update({
                ...payload,
                book_id: bookId
            });

            return book;
        } catch (error) {
            throw error;
        }
    }

    async getAllBook(limit, offset, where) {
        try {
            const { rows, count } = await Book.findAndCountAll({
                where,
                attributes: ['id', 'title', 'isbn', 'genre', 'language', 'cover', 'status'],
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'city', 'joined_date']
                    }
                ],
                limit,
                offset,
                order: [
                    ['created_at', 'DESC']
                ]
            })

            const books = rows.map((book) => book.toJSON());

            return { books, count };
        } catch (error) {
            throw error;
        }
    }

    async getBook(bookId) {
        try {
            const book = await Book.findByPk(bookId);

            if (!book) {
                throw new ApiError(404, 'Book not found');
            }

            return book.toJSON();
        } catch (error) {
            throw error;
        }
    }

    async bookSold(bookId) {
        try {
            const book = await Book.findByPk(bookId);
            if (!book) {
                throw new ApiError(404, 'Book not found');
            }

            book.total_copies_sold += 1;

            book.save();

            return book;
        } catch (error) {
            throw error;
        }
    }

    async royaltyService(bookId, amount) {
        try {
            const book = await Book.findByPk(bookId);
            if (!book) {
                throw new ApiError(404, 'Book not found');
            }

            const money = parseFloat(amount);
            book.royalty_pending -= money
            book.total_royalty_earned += money
            book.royalty_paid += money
            book.last_royalty_payout_date = new Date();

            book.save();

            return book;
        } catch (error) {
            throw error;
        }
    }

    async authorStatics(userId) {
        try {
            const stats = await Book.findOne({
                where: { author_id: userId },
                attributes: [
                    [fn('COUNT', col('id')), 'bookCount'],
                    [fn('SUM', col('total_copies_sold')), 'totalCopiesSold'],
                    [fn('SUM', col('total_royalty_earned')), 'totalRoyaltyEarned'],
                    [fn('SUM', col('royalty_paid')), 'royaltyPaid'],
                   
                    [fn('MAX', col('last_royalty_payout_date')), 'latestPayoutDate']
                ],
                raw: true
            });

            return stats;
        } catch (error) {
            throw error;
        }
    }

    async getBookList(userId) {

        const rawBooks = await Book.findAll({
            where: {
                author_id: userId
            },
            attributes: ['id', 'title']
        });

        return rawBooks.map((book) => book.toJSON());
    }
};

export default new BookService();


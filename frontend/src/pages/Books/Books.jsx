import { useEffect, useState } from "react";
import AddBook from "./AddBook";
import { useNavigate } from "react-router-dom";
import useApi from "../../api/axiosInstance";

const Books = () => {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const { data } = await useApi.get(
                `/book?page=${page}&limit=${limit}&search=${debouncedSearch}`
            );
            setBooks(data?.books || []);
            setPagination(data?.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, limit, debouncedSearch]);

    return (
        <div className="p-6 w-full h-full overflow-auto bg-gray-50">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 gap-4">

                <h1 className="text-2xl font-bold text-gray-800">My Books</h1>

                <div className="flex items-center gap-3">

                    {/* 🔍 Search */}
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-[250px] focus:outline-none focus:ring-2 focus:ring-[#002b5b]"
                    />

                    {/* Add Book */}
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-[#002b5b] text-white px-4 py-2 rounded-lg hover:bg-[#001f40]"
                    >
                        + Add Book
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && <p className="text-gray-500">Loading books...</p>}

            {/* Grid */}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {books && books.map((book) => (
                        <div
                            key={book.id}
                            onClick={() => navigate(`/book/${book.id}`)}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                        >
                            {/* Cover Image */}
                            <div className="relative h-66 w-full overflow-hidden">
                                <img
                                    src={book.cover?.front || 'https://i.ibb.co/nNcjwNg8/1003w-WZE2-VIj5-AVQ.webp'}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />

                                {/* Status Badge */}
                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                    {book.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Title */}
                                <h2 className="font-semibold text-gray-800 line-clamp-1 text-lg">
                                    {book.title}
                                </h2>

                                {/* Author */}
                                <p className="text-sm text-gray-500 mt-1">
                                    by {book?.author?.name}
                                </p>

                                {/* Genre */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {book.genre?.slice(0, 2).map((g, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && books.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    No books found 📭
                </p>
            )}

            {/* Pagination (BOTTOM ONLY) */}
            {pagination?.total > limit && (
                <div className="flex justify-center items-center gap-2 mt-10">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1
                                ? "bg-[#002b5b] text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <select value={limit} onChange={(e) => setLimit(+e.target.value)}>
                        <option value="10">10</option>
                        <option value="30">20</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
            )}

            {/* Modal */}
            <AddBook
                open={open}
                close={() => setOpen(false)}
                setBooks={setBooks}
            />
        </div>
    );
};

export default Books;
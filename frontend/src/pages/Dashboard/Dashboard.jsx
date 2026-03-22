import { useEffect, useState } from "react";
import useApi from "../../api/axiosInstance";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [books, setBooks] = useState([]);

    const fetchDashboard = async () => {
        try {
            const [statsRes, booksRes] = await Promise.all([
                useApi.get(`/book/state`),
                useApi.get(`/book?page=1&limit=5&search=`)
            ]);

            setStats(statsRes?.data?.states);
            setBooks(booksRes?.data?.books || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">

            {/* ===== STATS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <StatCard title="Total Books" value={stats?.bookCount} />

                <StatCard title="Copies Sold" value={stats?.totalCopiesSold} />

                <StatCard
                    title="Royalty Earned"
                    value={`₹ ${stats?.totalRoyaltyEarned}`}
                    highlight="text-green-600"
                />

                <StatCard
                    title="Royalty Paid"
                    value={`₹ ${stats?.royaltyPaid}`}
                    highlight="text-blue-600"
                />
            </div>

            {/* ===== PAYOUT ===== */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-500">Last Payout</p>
                <h2 className="text-lg font-semibold mt-1">
                    {stats?.latestPayoutDate
                        ? new Date(stats.latestPayoutDate).toLocaleDateString()
                        : "No payout yet"}
                </h2>
            </div>

            {/* ===== BOOKS ===== */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Recent Books</h2>

                <div className="divide-y">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 px-2 rounded-lg transition"
                        >
                            {/* COVER */}
                            <img
                                src={
                                    book?.cover?.front ||
                                    "https://via.placeholder.com/60x80"
                                }
                                className="w-14 h-20 rounded-md object-cover"
                            />

                            {/* INFO */}
                            <div className="flex-1">
                                <p className="font-medium">{book.title}</p>

                                <p className="text-sm text-gray-500">
                                    {book.genre?.join(", ")} • {book.language}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {book.author?.name} • {book.author?.city}
                                </p>
                            </div>

                            {/* STATUS */}
                            <StatusBadge status={book.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value, highlight }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className={`text-2xl font-semibold mt-1 ${highlight || ""}`}>
                {value || 0}
            </h2>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const getColor = () => {
        if (status?.toLowerCase().includes("edit"))
            return "bg-yellow-100 text-yellow-700";
        if (status?.toLowerCase().includes("progress"))
            return "bg-blue-100 text-blue-700";
        if (status?.toLowerCase().includes("resolved"))
            return "bg-green-100 text-green-700";
        return "bg-gray-100 text-gray-600";
    };

    return (
        <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getColor()}`}
        >
            {status}
        </span>
    );
};
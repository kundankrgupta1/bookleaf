import { useEffect, useState } from "react";
import useApi from "../../api/axiosInstance";

const CreateTicket = ({ open, close, setTickets, setMessages }) => {
    const [form, setForm] = useState({
        bookId: "",
        subject: "",
        description: "",
        attachments: null
    });

    const [bookList, setBookList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBookList = async () => {
            setLoading(true);
            try {
                const { data } = await useApi.get("/book/list");
                setBookList(data?.books || []);
            } catch (error) {
                setError(error?.response?.data?.message || "Error while getting books");
            } finally {
                setLoading(false);
            }
        };
        fetchBookList();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.subject) {
            return setError("Subject is required");
        };

        if (!form.description) {
            return setError("Message is required");
        };

        setError(null);
        setSubmitting(true);

        try {
            const { data } = await useApi.post("/ticket", form);
            setTickets((prev) => [...prev, data?.ticket]);
            setMessages((prev) => [...prev, data?.message]);
            close();
        } catch (error) {
            setError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn flex flex-col gap-4">

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create Support Ticket</h2>
                    <button onClick={close} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Select Book</label>
                        <select
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                            value={form.bookId}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, bookId: e.target.value }))
                            }
                        >
                            {loading && <option value="">Please wait...</option>}

                            {!loading && (
                                <>
                                    <option value="">Choose a book</option>

                                    {bookList?.map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {book.title}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Subject</label>
                        <input
                            type="text"
                            placeholder="e.g. Payment issue"
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                            value={form.subject}
                            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            rows="4"
                            placeholder="Describe your issue..."
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none resize-none"
                            value={form.description}
                            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Attachments</label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 transition">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                id="fileUpload"
                                onChange={(e) => setForm((prev) => ({ ...prev, attachments: e.target.files }))}
                            />
                            <label htmlFor="fileUpload" className="cursor-pointer text-gray-500">
                                Click to upload files 📎
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;
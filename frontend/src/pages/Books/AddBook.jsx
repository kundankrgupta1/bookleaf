import { useState } from "react";
import useApi from "../../api/axiosInstance";

const AddBook = ({ open, close, setBooks }) => {

    const [form, setForm] = useState({
        title: "",
        genre: "",
        language: "",
        file: ""
    });

    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            setForm({ ...form, file });
        }
    };

    const handleSubmit = async () => {
        try {
            if (!form?.title?.trim()) {
                return setError('Title is required');
            };


            if (!form?.genre?.trim()) {
                return setError('Genre is required');
            };


            if (!form?.language?.trim()) {
                return setError('Language is required');
            };

            setError(null);

            const { data } = await useApi.post("/book", {
                ...form,
                genre: form.genre.split(",")
            });

            setBooks((prev) => [data.book, ...prev]);
            close();
        } catch (err) {
            console.error(err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl w-[420px] shadow-xl">

                <h2 className="text-xl font-bold mb-4">Add Book</h2>

                {/* Inputs */}
                <input
                    value={form.title}
                    placeholder="Book Title"
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full mb-3 border p-2 rounded-lg"
                />

                <input
                    value={form.genre}
                    placeholder="Genre (comma separated)"
                    onChange={(e) => setForm((prev) => ({ ...prev, genre: e.target.value }))}
                    className="w-full mb-3 border p-2 rounded-lg"
                />

                <input
                    value={form.language}
                    placeholder="Language"
                    onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full mb-4 border p-2 rounded-lg"
                />

                {/* 🔥 Drag & Drop Upload */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition
                        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                    `}
                >
                    {form.file ? (
                        <div className="text-sm text-green-600 font-medium">
                            ✅ {form.file.name}
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-2">
                                Drag & drop your manuscript here
                            </p>

                            <label className="text-blue-500 cursor-pointer font-medium">
                                or choose file
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) => setForm((prev) => ({ ...prev, file: e.target.files }))}
                                    className="hidden"
                                />
                            </label>
                        </>
                    )}
                </div>
                {error &&
                    <p className="mt-2 text-red-600">{error}</p>
                }

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={close} className="px-4 py-2 text-gray-600">
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-[#002b5b] text-white px-4 py-2 rounded-lg"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
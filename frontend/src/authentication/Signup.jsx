import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../api/axiosInstance";

const Signup = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        joiningDate: "",
        role: "AUTHOR"
    });

    const handleChange = (e) => {
        setError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) return setError("Name is required");

        if (!form.email.includes("@"))
            return setError("Invalid email format");

        if (form.password.length < 4)
            return setError("Password must be at least 4 characters");

        if (!form.phone || form.phone.length < 10)
            return setError("Enter valid phone number");
        setError(null);
        setLoading(true);
        try {
            const { data } = await useApi.post("/user/register", form);
            setMessage(data?.message);
            setTimeout(() => {
                setMessage('');
                navigate("/");
            }, 2000);
        } catch (err) {
            setError(err?.response?.data?.message || "Signup error");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-center">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="date"
                        name="joiningDate"
                        value={form.joiningDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    {error && (
                        <p className="text-red-500 font-bold text-sm">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 font-bold text-sm">{message}</p>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg bg-pink-500 text-white font-semibold shadow-lg transition
                        ${(!form.email || !form.password) ? 'opacity-50' : 'hover:bg-pink-600'}
                        `}
                    >
                        {loading ? 'Please wait...' : 'Sign Up'}
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Signup;
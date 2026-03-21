import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { loading, syncAuthState, login } = useAuth();
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email.includes("@")) {
            return setError("Invalid email format");
        }

        if (form.password.length < 4) {
            return setError("Password must be at least 4 characters");
        }
        try {
            const session = await login(form)
            syncAuthState(session);
            navigate('/dashboard');
        } catch (err) {
            setError(err?.response?.data?.message || 'Login error');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center ">
            <div className="backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center">
                    Login
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 flex flex-col gap-4">

                    {/* Email */}
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-gray-900">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full mt-1 px-4 py-2 border rounded-lg placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    {error && <p className="text-red-500 font-bold text-sm">{error}</p>}

                    <div className="text-right text-sm text-gray-900">
                        <span className="cursor-pointer">Forgot Password?</span>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg bg-pink-500 transition duration-300 text-white font-semibold shadow-lg
                            ${(!form.email || !form.password) ? 'opacity-50' : 'cursor-pointer hover:bg-pink-600'}
                            `                        }
                        disabled={loading || !form.email || !form.password}
                    >
                        Login
                        {/* {loading ? "Please wait..." : "Login"} */}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center">
                    <div className="flex-1 h-px bg-white/30"></div>
                    <span className="px-3 text-gray-900 text-sm">OR</span>
                    <div className="flex-1 h-px bg-white/30"></div>
                </div>

                {/* Social Login */}
                <div className="flex gap-4">
                    <button className="flex-1 text-white bg-blue-500 text-black py-2 rounded-lg hover:bg-blue-600">
                        Google
                    </button>
                </div>

                {/* Signup */}

                <p className="text-center text-gray-900 text-sm">
                    Don't have an account?{" "}
                    <span className="text-blue-500 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/register")}
                    >
                        Sign up
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Login;
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const STORED_USER_KEY = 'user';
const STORED_TOKEN_KEY = 'token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ start true

    // ✅ INITIAL LOAD (fix flicker)
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(STORED_USER_KEY);
            const storedToken = localStorage.getItem(STORED_TOKEN_KEY);

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (err) {
            console.error("Auth load error:", err);
        } finally {
            setLoading(false); // ✅ IMPORTANT
        }
    }, []);

    const syncAuthState = (session) => {
        if (!session) {
            setToken(null);
            setUser(null);
            localStorage.removeItem(STORED_TOKEN_KEY);
            localStorage.removeItem(STORED_USER_KEY);
            return;
        }

        setToken(session?.token);
        setUser(session?.user);

        localStorage.setItem(STORED_TOKEN_KEY, session?.token);
        localStorage.setItem(STORED_USER_KEY, JSON.stringify(session?.user));
    };

    const login = async (payload) => {
        setLoading(true);
        try {
            const { data } = await api.post(`/user/login`, payload);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        syncAuthState(null);
    };

    const isAuth = Boolean(user?.id && token);

    return (
        <AuthContext.Provider value={{
            isAuth,
            token,
            user,
            loading,
            syncAuthState,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
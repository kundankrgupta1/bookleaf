import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const LOGIN_ROUTE = "/";
const PRIVATE_REDIRECT = "/dashboard";
const AUTH_PAGES = ["/", "/register"];

const RouteGuard = ({ children, isPrivate, role }) => {
    const { isAuth, user, loading } = useAuth();
    const { pathname } = useLocation();

    // ✅ FIX: Prevent flicker
    if (loading) return <Loader />;

    // 🔐 Private route protection
    if (isPrivate && !isAuth) {
        return <Navigate to={LOGIN_ROUTE} replace state={{ from: pathname }} />;
    }

    // 🚫 Block login/register after login
    if (!isPrivate && isAuth && AUTH_PAGES.includes(pathname)) {
        return <Navigate to={PRIVATE_REDIRECT} replace />;
    }

    // 🛡️ Role-based protection
    if (isPrivate && role && user?.role !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RouteGuard;
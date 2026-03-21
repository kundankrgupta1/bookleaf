import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ routes, onNavigate }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const filteredRoutes = routes.filter((route) => {
        if (!route.isPrivate || route.hideInMenu) return false;
        if (!route.role) return true;
        return route.role === user?.role;
    });

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className='flex flex-col gap-2 p-2 max-w-[250px] border-r'>

            <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 py-2 font-bold text-[#002b5b]"
            >
                <img src='/logo.jpg' className='w-8 h-8 rounded-full' />
                BookLeaf
            </Link>

            <ul className="flex-1 space-y-1 overflow-y-auto">
                {filteredRoutes.map((item) => {
                    const isActive = pathname.startsWith(item.path.split("/:")[0]);

                    return (
                        <li
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                onNavigate?.();
                            }}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer
                                ${isActive
                                    ? "bg-[#002b5b] text-white"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            {item.icon && <item.icon />}
                            {item.label}
                        </li>
                    );
                })}
            </ul>

            <div className="border-t pt-2 flex flex-col gap-2">

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/profile/${user?.id}`)}
                >
                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-[#002b5b] text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>

                    <div>
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 py-2 rounded hover:bg-red-100"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
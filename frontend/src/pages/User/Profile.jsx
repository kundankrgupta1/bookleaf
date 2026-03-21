import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../api/axiosInstance";

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const { data } = await useApi.get(`/user/${userId}`);

                if (isMounted) {
                    setUser(data?.user);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error?.response?.data?.message || 'something went wrong');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (loading) {
        return (<p>Please wait...</p>)
    }

    if (error) {
        return (<p>Error: {error}</p>)
    }

    return (
        <div className="p-6 w-full h-full overflow-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 text-sm">
                    Your personal information overview
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl">

                {/* Top Section (Profile Picture + Basic Info) */}
                <div className="flex items-center gap-6 border-b pb-6 mb-6">

                    {/* Profile Picture */}
                    <div className="relative">
                        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-[#002b5b] text-white text-2xl font-bold shadow">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>

                        {/* Optional status dot */}
                        <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>

                    {/* Basic Info */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {user?.name}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {user?.email}
                        </p>

                        <span className="mt-2 inline-block text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Phone */}
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">
                            {user?.phone || "—"}
                        </p>
                    </div>

                    {/* City */}
                    <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium text-gray-800">
                            {user?.city || "—"}
                        </p>
                    </div>

                    {/* Joined Date */}
                    <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium text-gray-800">
                            {user?.joined_date
                                ? new Date(user.joined_date).toLocaleDateString()
                                : "—"}
                        </p>
                    </div>

                    {/* Account ID */}
                    <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium text-gray-800 truncate">
                            {user?.id}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://fintracker-backend-v4fu.onrender.com/notifications", {
                    headers: { "x-auth-token": token }
                });
                setNotifications(res.data.notifications || []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                "https://fintracker-backend-v4fu.onrender.com/notifications/markAllRead",
                {},
                { headers: { "x-auth-token": token } }
            );
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2.5 h-2.5 bg-red-500 rounded-full border-1 border-white dark:border-gray-800"></span>
                )}
            </button>

            {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="font-semibold dark:text-white">Notifications</span>
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Mark all as read
                        </button>
                    </div>

                    {loading ? (
                        <div className="px-4 py-2 text-gray-500">Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n._id || n.id}
                                className={`px-4 py-2 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 ${!n.read ? "font-bold" : "font-normal"
                                    }`}
                            >
                                {n.message}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;

import { useEffect, useCallback } from "react";
import { FiUsers, FiX } from "react-icons/fi";
import Avatar from "../ui/Avatar";
import authStore from "../../store/auth.store";
import socket from "../../lib/socket";
import axiosInstance from "../../lib/axios";
import useUserStore from "../../store/user.store";

function Sidebar({ isOpen, selectedUserId, onSelectUser, onClose }) {
    const { user: currentUser } = authStore();
    const { allUsers, setAllUsers, onlineUsers, setOnlineUsers } = useUserStore();

    useEffect(() => {
        axiosInstance
            .get("/users")
            .then((res) => setAllUsers(res.data.users))
            .catch(console.error);
    }, [setAllUsers]);

    useEffect(() => {
        const handleActiveUsers = (users) => setOnlineUsers(users || []);
        const handleUserOnline = (user) => {
            setOnlineUsers(prev => {
                const exists = prev.find(u => u._id === user._id);
                return exists ? prev : [...prev, user];
            });
        };
        const handleUserOffline = (userId) => {
            setOnlineUsers(prev => prev.filter(u => u._id !== userId));
        };

        socket.on("active-users", handleActiveUsers);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);
        socket.emit("getActiveUsers");

        return () => {
            socket.off("active-users", handleActiveUsers);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);
        };
    }, [setOnlineUsers]);

    const isOnline = useCallback(
        (id) => onlineUsers.some((u) => u._id === id),
        [onlineUsers]
    );

    const isSelf = useCallback(
        (id) => currentUser?._id === id,
        [currentUser]
    );

    const getSortedUsers = () => {
        const merged = [...allUsers];
        if (currentUser && !merged.some((u) => u._id === currentUser._id)) {
            merged.unshift(currentUser);
        }
        return merged.sort((a, b) => {
            if (a._id === currentUser?._id) return -1;
            if (b._id === currentUser?._id) return 1;
            const aOnline = isOnline(a._id) ? 1 : 0;
            const bOnline = isOnline(b._id) ? 1 : 0;
            return bOnline - aOnline;
        });
    };

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <div className="sidebar-title">
                    <div className="navbar-brand-icon">
                        <FiUsers size={12} />
                    </div>
                    <span>Telegram</span>
                </div>

                <button
                    onClick={onClose}
                    className="btn btn-ghost md:hidden"
                    aria-label="Close"
                >
                    <FiX size={18} />
                </button>
            </div>

            <div className="sidebar-content">
                <div className="contact-list">
                    {getSortedUsers().map((user) => {
                        const online = isOnline(user._id);
                        const self = isSelf(user._id);
                        const active = selectedUserId === user._id;

                        return (
                            <button
                                key={user._id}
                                className={`contact-item ${active ? "active" : ""}`}
                                onClick={() => onSelectUser(user)}
                            >
                                <Avatar username={user.username} />

                                <div className="contact-info">
                                    <div className="contact-name">
                                        {user.username}
                                        {self && " (You)"}
                                    </div>
                                    <div className="contact-status">
                                        <div className={`status-indicator ${online ? "" : "offline"}`} />
                                        {online ? "online" : "last seen recently"}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

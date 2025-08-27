// File: src/components/chat/Sidebar.jsx

import { useEffect, useCallback } from "react";
import { FiUsers, FiX } from "react-icons/fi";
import Avatar from "../ui/Avatar";
import authStore from "../../store/authStore";
import socket from "../../lib/socketClient";
import axiosInstance from "../../lib/httpClient";
import useUserStore from "../../store/userStore";

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
        const handleUserOnline = () => {
            // Always refresh the list from server for accuracy
            socket.emit("getActiveUsers");
        };
        const handleUserOffline = () => {
            // Always refresh the list from server for accuracy
            socket.emit("getActiveUsers");
        };
        const handleError = (error) => {
            console.error("Socket error in Sidebar:", error);
        };
        const handleUnauthorized = (data) => {
            console.error("Socket unauthorized:", data);
            // Could trigger logout here if needed
        };

        socket.on("active-users", handleActiveUsers);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);
        socket.on("error", handleError);
        socket.on("unauthorized", handleUnauthorized);
        socket.emit("getActiveUsers");

        return () => {
            socket.off("active-users", handleActiveUsers);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);
            socket.off("error", handleError);
            socket.off("unauthorized", handleUnauthorized);
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
                    <span>Contacts</span>
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
                                        {online ? "online" : "offline"}
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

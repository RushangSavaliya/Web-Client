// File: src/components/home/ChatSidebar.jsx

import { useEffect, useCallback } from "react";
import { FiCircle, FiMessageCircle, FiUsers, FiX } from "react-icons/fi";
import authStore from "../../store/auth.store";
import socket from "../../lib/socket";
import axiosInstance from "../../lib/axios";
import useUserStore from "../../store/user.store"; // ✅ Zustand store

function ChatSidebar({ isOpen, selectedUserId, onSelectUser, onClose }) {
    const { user: currentUser } = authStore();

    // ✅ Zustand: store all and online users
    const {
        allUsers,
        setAllUsers,
        onlineUsers,
        setOnlineUsers,
    } = useUserStore();

    // ✅ Fetch all registered users once
    useEffect(() => {
        axiosInstance
            .get("/users")
            .then((res) => setAllUsers(res.data.users))
            .catch(console.error);
    }, [setAllUsers]);

    // ✅ Listen to socket online users
    useEffect(() => {
        socket.on("active-users", setOnlineUsers);
        return () => socket.off("active-users");
    }, [setOnlineUsers]);

    // ✅ Check if user is online
    const isOnline = useCallback(
        (id) => onlineUsers.some((u) => u._id === id),
        [onlineUsers]
    );

    const isSelf = useCallback(
        (id) => currentUser?._id === id,
        [currentUser]
    );

    // ✅ Merged and sorted user list
    const getAllSortedUsers = () => {
        const merged = [...allUsers];

        // Add self if not included
        if (
            currentUser &&
            !merged.some((u) => u._id === currentUser._id)
        ) {
            merged.unshift(currentUser);
        }

        // Sort: self → online → offline
        return merged.sort((a, b) => {
            if (a._id === currentUser?._id) return -1;
            if (b._id === currentUser?._id) return 1;

            const aOnline = isOnline(a._id) ? 1 : 0;
            const bOnline = isOnline(b._id) ? 1 : 0;

            return bOnline - aOnline;
        });
    };

    const getUserRowClass = (active, self) =>
        [
            "list-row items-center rounded-xl transition-colors cursor-pointer select-none",
            active ? "bg-primary text-primary-content shadow-md" : "hover:bg-base-200 active:bg-base-300",
            self ? "border border-primary/30" : "",
        ].join(" ");

    const getAvatarClass = (active, self) =>
        [
            "size-10 rounded-full font-medium text-sm flex items-center justify-center relative shrink-0",
            active
                ? "bg-primary-content text-primary"
                : self
                    ? "bg-primary/20 text-primary border-2 border-primary/50"
                    : "bg-neutral text-neutral-content",
        ].join(" ");

    const getStatusClass = (online, active) =>
        [
            "w-2 h-2",
            online
                ? active
                    ? "text-primary-content"
                    : "text-success"
                : active
                    ? "text-primary-content/50"
                    : "text-base-content/30",
        ].join(" ");

    const getStatusTextClass = (active) =>
        [
            "text-xs flex items-center gap-1 select-none",
            active ? "text-primary-content/70" : "text-base-content/60",
        ].join(" ");

    function UserRow({ user }) {
        const online = isOnline(user._id);
        const self = isSelf(user._id);
        const active = selectedUserId === user._id;

        return (
            <li
                key={user._id}
                onClick={() => onSelectUser(user)}
                className={getUserRowClass(active, self)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectUser(user);
                    }
                }}
                role="button"
                aria-pressed={active}
            >
                <div className={getAvatarClass(active, self)} aria-hidden="true">
                    {user.username.charAt(0).toUpperCase()}
                    {self && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow">
                            <FiMessageCircle className="w-2.5 h-2.5 text-primary-content" />
                        </div>
                    )}
                </div>

                <div className="list-col-grow min-w-0">
                    <div className="font-semibold truncate text-sm sm:text-base">
                        {user.username} {self && "(You)"}
                    </div>
                    <div className={getStatusTextClass(active)}>
                        <FiCircle className={getStatusClass(online, active)} />
                        {online ? "Online" : "Offline"}
                    </div>
                </div>
            </li>
        );
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-80 sm:w-96 border-r border-base-300 bg-base-100 transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
                aria-label="Contacts sidebar"
            >
                <div className="h-full flex flex-col bg-base-100">
                    <div className="p-4 sm:p-5 border-b border-base-300 bg-base-100 sticky top-0 z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-content p-2 rounded-lg shadow-sm">
                                <FiUsers className="w-4 h-4" />
                            </div>
                            <h1 className="text-lg font-semibold tracking-wide select-none">Contacts</h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm md:hidden"
                            aria-label="Close contacts"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                        <ul className="list space-y-2" role="list">
                            {getAllSortedUsers().map((user) => (
                                <UserRow key={user._id} user={user} />
                            ))}
                        </ul>
                    </div>

                    <div className="p-3 border-t border-base-300 bg-base-50 md:hidden">
                        <p className="text-xs text-base-content/50 text-center select-none">
                            Tap a user to start chatting
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default ChatSidebar;

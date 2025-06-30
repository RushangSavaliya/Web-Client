// File: src/components/UserList.jsx

import { useEffect, useState } from "react";
import { FiCircle, FiMessageCircle, FiUsers, FiX } from "react-icons/fi";
import socket from "../lib/socket";
import authStore from "../store/auth.store";

/**
 * UserList
 *  - Displays a list of users (contacts) with their online status.
 *  - Allows selecting a user to chat with.
 *  - Highlights the current user and the active chat.
 */
export default function UserList({ onSelect, activeUserId, onClose }) {
  // -------------------- State & Auth --------------------
  const [users, setUsers] = useState([]);
  const { user: currentUser } = authStore();

  // -------------------- Socket: Listen for active users --------------------
  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  // -------------------- Helpers --------------------

  /**
   * Returns all users, ensuring current user is included and sorted:
   * - Current user first
   * - Then online users
   * - Then offline users
   */
  const getAllUsers = () => {
    const allUsers = [...users];
    // Ensure current user is present
    if (currentUser && !allUsers.find((u) => u._id === currentUser._id)) {
      allUsers.unshift({ ...currentUser, isOnline: true });
    }
    // Sort users
    return allUsers.sort((a, b) => {
      if (a._id === currentUser?._id) return -1;
      if (b._id === currentUser?._id) return 1;
      const aOnline = users.some((u) => u._id === a._id) ? 1 : 0;
      const bOnline = users.some((u) => u._id === b._id) ? 1 : 0;
      return bOnline - aOnline;
    });
  };

  /** Returns true if user is online */
  const isUserOnline = (userId) => users.some((u) => u._id === userId);

  /** Returns true if user is the current user */
  const isCurrentUser = (userId) => currentUser?._id === userId;

  // -------------------- Render --------------------
  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* ---------- Header ---------- */}
      <div className="p-4 sm:p-5 border-b border-base-300 bg-base-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-content p-2 rounded-lg shadow-sm">
              <FiUsers className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-semibold tracking-wide">Contacts</h1>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm md:hidden"
            aria-label="Close contacts"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ---------- User List ---------- */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="list space-y-2">
          {getAllUsers().map((user) => {
            const isOnline = isUserOnline(user._id);
            const isSelf = isCurrentUser(user._id);
            const isActive = activeUserId === user._id;

            return (
              <li
                key={user._id}
                className={[
                  "list-row items-center rounded-xl transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-content shadow-md"
                    : "hover:bg-base-200 active:bg-base-300",
                  isSelf ? "border border-primary/30" : ""
                ].join(" ")}
                onClick={() => onSelect(user)}
              >
                {/* Avatar */}
                <div
                  className={[
                    "size-10 rounded-full font-medium text-sm flex items-center justify-center relative shrink-0",
                    isActive
                      ? "bg-primary-content text-primary"
                      : isSelf
                        ? "bg-primary/20 text-primary border-2 border-primary/50"
                        : "bg-neutral text-neutral-content"
                  ].join(" ")}
                >
                  {user.username.charAt(0).toUpperCase()}
                  {/* Self badge (current user) */}
                  {isSelf && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow">
                      <FiMessageCircle className="w-2.5 h-2.5 text-primary-content" />
                    </div>
                  )}
                </div>
                {/* User Info */}
                <div className="list-col-grow min-w-0">
                  <div className="font-semibold truncate text-sm sm:text-base">
                    {user.username} {isSelf && "(You)"}
                  </div>
                  <div
                    className={[
                      "text-xs flex items-center gap-1",
                      isActive
                        ? "text-primary-content/70"
                        : "text-base-content/60"
                    ].join(" ")}
                  >
                    <FiCircle
                      className={[
                        "w-2 h-2",
                        isOnline
                          ? isActive
                            ? "text-primary-content"
                            : "text-success"
                          : isActive
                            ? "text-primary-content/50"
                            : "text-base-content/30"
                      ].join(" ")}
                    />
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
                {/* Arrow for mobile */}
                <button className="btn btn-square btn-ghost md:hidden">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Footer (mobile hint) ---------- */}
      <div className="p-3 border-t border-base-300 bg-base-50 md:hidden">
        <p className="text-xs text-base-content/50 text-center">
          Tap a user to start chatting
        </p>
      </div>
    </div>
  );
}


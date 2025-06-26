// File: src/components/UserList.jsx

import { useEffect, useState } from "react";
import { FiCircle, FiMessageCircle, FiUsers, FiX } from "react-icons/fi";
import socket from "../lib/socket";
import authStore from "../store/auth.store";

// UserList component displays a list of users with online status and selection
export default function UserList({ onSelect, activeUserId, onClose }) {
  // State to hold the list of active users
  const [users, setUsers] = useState([]);
  // Get the current logged-in user from the auth store
  const { user: currentUser } = authStore();

  // --- Socket Event Subscription ---
  useEffect(() => {
    // Listen for "active-users" event and update users state
    socket.on("active-users", setUsers);
    // Cleanup on unmount
    return () => socket.off("active-users");
  }, []);

  // --- Helper Functions ---

  // Returns a sorted list of all users, ensuring current user is included and on top
  const getAllUsers = () => {
    const allUsers = [...users];
    if (currentUser && !allUsers.find((u) => u._id === currentUser._id)) {
      allUsers.unshift({ ...currentUser, isOnline: true });
    }
    return allUsers.sort((a, b) => {
      if (a._id === currentUser?._id) return -1;
      if (b._id === currentUser?._id) return 1;
      const aOnline = users.some((u) => u._id === a._id) ? 1 : 0;
      const bOnline = users.some((u) => u._id === b._id) ? 1 : 0;
      return bOnline - aOnline;
    });
  };

  // Checks if a user is online
  const isUserOnline = (userId) => users.some((u) => u._id === userId);

  // Checks if the user is the current logged-in user
  const isCurrentUser = (userId) => currentUser?._id === userId;

  // --- Render ---
  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Header Section */}
      <div className="p-4 sm:p-5 border-b border-base-300 shrink-0 bg-base-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-content p-2 rounded-lg shadow-sm">
              <FiUsers className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-semibold text-base-content tracking-wide">
              Contacts
            </h1>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm md:hidden"
            aria-label="Close contacts"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User List Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {getAllUsers().map((user) => {
            const isOnline = isUserOnline(user._id);
            const isSelf = isCurrentUser(user._id);
            const isActive = activeUserId === user._id;
            return (
              <button
                key={user._id}
                onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content shadow-md"
                    : "hover:bg-base-200 active:bg-base-300"
                } ${isSelf ? "border border-primary/30" : ""}`}
              >
                {/* User Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm shrink-0 relative ${
                    isActive
                      ? "bg-primary-content text-primary"
                      : isSelf
                      ? "bg-primary/20 text-primary border-2 border-primary/50"
                      : "bg-neutral text-neutral-content"
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}
                  {/* Icon for current user */}
                  {isSelf && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow">
                      <FiMessageCircle className="w-2.5 h-2.5 text-primary-content" />
                    </div>
                  )}
                </div>
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-sm sm:text-base">
                    {user.username} {isSelf && "(You)"}
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      isActive
                        ? "text-primary-content/70"
                        : "text-base-content/60"
                    }`}
                  >
                    {/* Online/Offline Indicator */}
                    <FiCircle
                      className={`w-2 h-2 ${
                        isOnline
                          ? isActive
                            ? "text-primary-content"
                            : "text-success"
                          : isActive
                          ? "text-primary-content/50"
                          : "text-base-content/30"
                      }`}
                    />
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
                {/* Arrow Icon for mobile */}
                <div className="md:hidden opacity-50">
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
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Section (Mobile Hint) */}
      <div className="p-3 border-t border-base-300 bg-base-50 md:hidden">
        <p className="text-xs text-base-content/50 text-center">
          Tap a user to start chatting
        </p>
      </div>
    </div>
  );
}

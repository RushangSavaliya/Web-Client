import { useEffect, useState } from "react";
import { X, Circle, MessageCircle } from "lucide-react";
import socket from "../lib/socket";
import authStore from "../store/auth.store";

export default function UserList({ onSelect, activeUserId, onClose }) {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = authStore();

  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  // Create a list with current user + all other users, online first
  const getAllUsers = () => {
    const allUsers = [...users];

    // Add current user to the list if not already present
    if (currentUser && !allUsers.find((u) => u._id === currentUser._id)) {
      allUsers.unshift({ ...currentUser, isOnline: true });
    }

    // Sort: online users first, then offline
    return allUsers.sort((a, b) => {
      // Current user always first
      if (a._id === currentUser?._id) return -1;
      if (b._id === currentUser?._id) return 1;

      // Then by online status
      const aOnline = users.some((u) => u._id === a._id) ? 1 : 0;
      const bOnline = users.some((u) => u._id === b._id) ? 1 : 0;
      return bOnline - aOnline;
    });
  };

  const isUserOnline = (userId) => {
    return users.some((u) => u._id === userId);
  };

  const isCurrentUser = (userId) => {
    return currentUser?._id === userId;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-base-300 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-base-content">Users</h1>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm p-1 md:hidden"
            aria-label="Close contacts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-3">
        <div className="space-y-1">
          {getAllUsers().map((user) => {
            const isOnline = isUserOnline(user._id);
            const isSelf = isCurrentUser(user._id);
            const isActive = activeUserId === user._id;

            return (
              <button
                key={user._id}
                onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg text-left transition-colors touch-manipulation ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 active:bg-base-300"
                } ${isSelf ? "border border-primary/30" : ""}`}
              >
                {/* User Avatar */}
                <div
                  className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 relative ${
                    isActive
                      ? "bg-primary-content text-primary"
                      : isSelf
                        ? "bg-primary/20 text-primary border-2 border-primary/50"
                        : "bg-neutral text-neutral-content"
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}

                  {/* Self chat indicator */}
                  {isSelf && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <MessageCircle className="w-2.5 h-2.5 text-primary-content" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm sm:text-base">
                    {user.username} {isSelf && "(You)"}
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      isActive
                        ? "text-primary-content/70"
                        : "text-base-content/60"
                    }`}
                  >
                    <Circle
                      className={`w-2 h-2 ${
                        isOnline
                          ? isActive
                            ? "fill-primary-content text-primary-content"
                            : "fill-success text-success"
                          : isActive
                            ? "fill-primary-content/50 text-primary-content/50"
                            : "fill-base-content/30 text-base-content/30"
                      }`}
                    />
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Mobile arrow indicator */}
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

      {/* Footer - Mobile Instructions */}
      <div className="p-3 border-t border-base-300 bg-base-50 md:hidden shrink-0">
        <p className="text-xs text-base-content/50 text-center">
          Tap a user to start chatting
        </p>
      </div>
    </div>
  );
}

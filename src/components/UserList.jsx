import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function UserList({ onSelect, activeUserId, onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-base-300 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-medium text-base-content">Contacts</h1>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm p-1 md:hidden"
            aria-label="Close contacts"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-base-content/60">{users.length} online</p>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-3">
        {users.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-300 flex items-center justify-center text-lg sm:text-xl mb-3 mx-auto">
              👥
            </div>
            <p className="text-sm text-base-content/60 px-4">
              No contacts online
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg text-left transition-colors touch-manipulation ${
                  activeUserId === user._id
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 active:bg-base-300"
                }`}
              >
                {/* User Avatar */}
                <div
                  className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    activeUserId === user._id
                      ? "bg-primary-content text-primary"
                      : "bg-neutral text-neutral-content"
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm sm:text-base">
                    {user.username}
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      activeUserId === user._id
                        ? "text-primary-content/70"
                        : "text-base-content/60"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activeUserId === user._id
                          ? "bg-primary-content"
                          : "bg-success"
                      }`}
                    ></div>
                    Online
                  </div>
                </div>

                {/* Arrow indicator for mobile */}
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
            ))}
          </div>
        )}
      </div>

      {/* Footer - Mobile Instructions */}
      <div className="p-3 border-t border-base-300 bg-base-50 md:hidden shrink-0">
        <p className="text-xs text-base-content/50 text-center">
          Tap a contact to start chatting
        </p>
      </div>
    </div>
  );
}

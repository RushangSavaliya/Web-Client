import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function UserList({ onSelect, activeUserId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 bg-base-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-base-content">
            Active Users
          </h2>
          <div className="badge badge-primary badge-sm">{users.length}</div>
        </div>
        <p className="text-sm text-base-content/60 mt-1">
          Choose someone to chat with
        </p>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-base-content/40 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-base-content/60">No users online</p>
            <p className="text-xs text-base-content/40 mt-1">
              Waiting for friends to join...
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`user-item flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-base-200 hover:shadow-sm ${
                activeUserId === user._id
                  ? "bg-primary text-primary-content shadow-md scale-[1.02]"
                  : "bg-base-100 hover:scale-[1.01]"
              }`}
              onClick={() => onSelect(user)}
            >
              {/* User Avatar */}
              <div className="avatar placeholder">
                <div
                  className={`w-10 rounded-full ${
                    activeUserId === user._id
                      ? "bg-primary-content text-primary"
                      : "bg-primary text-primary-content"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{user.username}</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeUserId === user._id
                          ? "bg-primary-content"
                          : "bg-success"
                      }`}
                    ></span>
                  </div>
                </div>
                <p
                  className={`text-xs ${
                    activeUserId === user._id
                      ? "text-primary-content/70"
                      : "text-base-content/60"
                  }`}
                >
                  Online
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-base-300 bg-base-50">
        <div className="text-xs text-base-content/50 text-center">
          Click on a user to start chatting
        </div>
      </div>
    </div>
  );
}

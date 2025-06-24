import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function UserList({ onSelect, activeUserId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <h1 className="text-lg font-medium text-base-content">Contacts</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {users.length} online
        </p>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-xl mb-3 mx-auto">
              👥
            </div>
            <p className="text-sm text-base-content/60">No contacts online</p>
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeUserId === user._id
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    activeUserId === user._id
                      ? "bg-primary-content text-primary"
                      : "bg-neutral text-neutral-content"
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.username}</div>
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
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

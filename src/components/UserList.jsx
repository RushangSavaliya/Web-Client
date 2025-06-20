// File: src/components/UserList.jsx

import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function UserList({ onSelect, activeUserId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("active-users", setUsers);
    return () => socket.off("active-users");
  }, []);

  return (
    <div className="w-full md:w-1/4 border-r p-3 bg-base-200 space-y-1">
      <h2 className="text-lg font-semibold mb-2">Active Users</h2>
      {users.map((user) => (
        <div
          key={user._id}
          className={`flex items-center justify-between p-2 cursor-pointer rounded-lg hover:bg-base-300 ${
            activeUserId === user._id ? "bg-primary text-white" : ""
          }`}
          onClick={() => onSelect(user)}
        >
          <span>{user.username}</span>
          <span className="badge badge-success badge-xs"></span>
        </div>
      ))}
    </div>
  );
}

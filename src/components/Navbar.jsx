// File: src/components/Navbar.jsx

import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isLoggedIn, user, onLogout }) {
  return (
    <div className="navbar bg-base-100 shadow sticky top-0 z-10 px-6">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">
          💬 ChatApp
        </Link>
      </div>

      {isLoggedIn && user && (
        <div className="flex items-center gap-4">
          <span className="font-medium text-base">
            Hello, <span className="text-primary">{user.username}</span>
          </span>
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </div>
  );
}

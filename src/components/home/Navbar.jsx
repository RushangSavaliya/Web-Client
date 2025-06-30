// File: src/components/home/Navbar.jsx

import { FaComments } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar({ isLoggedIn, user, onLogout }) {
  return (
    <nav className="h-14 sm:h-16 px-4 sm:px-6 border-b border-base-300 bg-base-100 flex items-center justify-between shadow-sm">
      {/* Logo Section */}
      <Link
        to="/"
        className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-base-content"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary text-primary-content flex items-center justify-center text-base sm:text-lg shadow-md">
          <FaComments className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="hidden xs:inline sm:inline tracking-wide">
          ChatApp
        </span>
      </Link>

      {/* User Info & Actions */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Username and Status */}
          <UserInfo username={user.username} />
          {/* User Avatar */}
          <UserAvatar username={user.username} />
          {/* Logout Button */}
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </nav>
  );
}

// Extracted components for readability

function UserInfo({ username }) {
  return (
    <div className="hidden sm:block text-right">
      <div className="text-sm font-semibold text-base-content truncate max-w-32">
        {username}
      </div>
      <div className="text-xs text-base-content/60">Online</div>
    </div>
  );
}

function UserAvatar({ username }) {
  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-medium shadow-inner shrink-0">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="btn btn-ghost btn-sm h-9 w-9 p-0 hover:bg-base-200"
      title="Logout"
      aria-label="Logout"
    >
      <FiLogOut className="w-4 h-4 text-base-content" />
    </button>
  );
}

export default Navbar;


import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isLoggedIn, user, onLogout }) {
  return (
    <nav className="h-14 sm:h-16 px-4 sm:px-6 border-b border-base-300 bg-base-100 flex items-center justify-between">
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold text-base-content"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center text-base sm:text-lg">
          💬
        </div>
        <span className="hidden xs:inline sm:inline">ChatApp</span>
      </Link>

      {/* User Menu */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info - Hidden on very small screens */}
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-base-content truncate max-w-32 lg:max-w-none">
              {user.username}
            </div>
            <div className="text-xs text-base-content/60">Online</div>
          </div>

          {/* User Avatar */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Logout Button */}
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </nav>
  );
}

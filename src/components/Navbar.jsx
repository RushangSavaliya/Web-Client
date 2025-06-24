import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isLoggedIn, user, onLogout }) {
  return (
    <nav className="h-16 px-6 border-b border-base-300 bg-base-100 flex items-center justify-between">
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-3 text-xl font-semibold text-base-content"
      >
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center text-lg">
          💬
        </div>
        ChatApp
      </Link>

      {/* User Menu */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-base-content">
              {user.username}
            </div>
            <div className="text-xs text-base-content/60">Online</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-medium">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </nav>
  );
}

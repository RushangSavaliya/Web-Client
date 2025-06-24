import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isLoggedIn, user, onLogout }) {
  return (
    <div className="navbar bg-base-100 shadow-md border-b border-base-300 px-4 lg:px-6">
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary hover:scale-105 transition-transform"
        >
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-8 rounded-lg">
              <span className="text-lg">💬</span>
            </div>
          </div>
          ChatApp
        </Link>
      </div>

      {isLoggedIn && user && (
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-base-content">
                {user.username}
              </div>
              <div className="text-xs text-base-content/60 flex items-center gap-1 justify-end">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                Online
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content w-10 rounded-full">
                <span className="text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile User Avatar */}
          <div className="sm:hidden">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content w-8 rounded-full">
                <span className="text-xs font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </div>
  );
}

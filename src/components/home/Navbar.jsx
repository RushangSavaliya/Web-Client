// File: src/components/home/Navbar.jsx

import { FaComments, FaBars } from "react-icons/fa";
import LogoutButton from "./modules/LogoutButton";
import UserAvatar from "./modules/UserAvatar"; 

function Navbar({ isLoggedIn, user, onLogout, onToggleSidebar }) {
  return (
    <nav className="h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none md:hidden mr-2 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Open contacts"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex-1 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base sm:text-lg shadow-md shrink-0">
          <FaComments className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="hidden xs:inline truncate">ChatApp</span>
      </div>

      {/* User Info & Actions */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <UserInfo username={user.username} />
          <UserAvatar username={user.username} size="sm" />
          <LogoutButton onLogout={onLogout} />
        </div>
      )}
    </nav>
  );
}

function UserInfo({ username }) {
  return (
    <div className="hidden sm:block text-right max-w-[120px] truncate">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
        {username}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
    </div>
  );
}



export default Navbar;

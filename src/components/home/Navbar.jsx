// File: src/components/home/Navbar.jsx

import { FaComments, FaBars } from "react-icons/fa";
import { Themes } from "../../const/themes";
import useThemeStore from "../../store/theme.store";
import LogoutButton from "./modules/LogoutButton";
import UserAvatar from "./modules/UserAvatar"; 

function Navbar({ isLoggedIn, user, onLogout, onToggleSidebar }) {
  return (
    <nav className="h-14 sm:h-16 px-4 sm:px-6 border-b border-base-300 bg-base-100 flex items-center justify-between shadow-sm">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="btn btn-ghost btn-sm md:hidden mr-2"
        aria-label="Open contacts"
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-base-content flex-1 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary text-primary-content flex items-center justify-center text-base sm:text-lg shadow-md shrink-0">
          <FaComments className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="hidden xs:inline truncate">ChatApp</span>
      </div>

      {/* User Info & Actions */}
      {isLoggedIn && user && (
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <ThemeSelector />
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
      <div className="text-sm font-semibold text-base-content truncate">
        {username}
      </div>
      <div className="text-xs text-base-content/60">Online</div>
    </div>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-sm btn-outline capitalize max-w-[9rem] sm:max-w-[10rem] truncate"
        title={theme}
      >
        {theme}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] mt-2 p-2 shadow bg-base-100 rounded-box w-[9rem] sm:w-[10rem] max-h-52 overflow-y-auto overflow-x-hidden flex flex-col gap-1"
      >
        {Themes.map((t) => {
          const name = typeof t === "string" ? t : t.name;
          const icon = typeof t === "object" && t.icon;

          return (
            <li key={name}>
              <button
                onClick={() => setTheme(name)}
                className={`capitalize btn btn-sm w-full text-left truncate flex items-center gap-2 ${name === theme ? "btn-primary" : "btn-ghost"}`}
              >
                {icon && (
                  <img
                    src={icon}
                    alt={`${name} logo`}
                    className="w-4 h-4 rounded-sm object-contain"
                  />
                )}
                <span>{name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Navbar;

import { FaComments, FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Avatar from "../ui/Avatar";
import authStore from "../../store/auth.store";

function Navbar({ user, onToggleSidebar }) {
  const { logout } = authStore();

  return (
    <nav className="navbar">
      <button
        onClick={onToggleSidebar}
        className="btn btn-ghost md:hidden"
        aria-label="Open menu"
      >
        <FaBars size={16} />
      </button>

      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <FaComments size={14} />
        </div>
        <span className="hidden sm:inline">ChatApp</span>
      </div>

      {user && (
        <div className="navbar-actions">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm font-medium">{user.username}</span>
            <div className="flex items-center gap-1 text-xs">
              <div className="status-indicator" />
              Online
            </div>
          </div>
          
          <Avatar username={user.username} size="sm" />
          
          <button
            onClick={logout}
            className="btn btn-ghost"
            title="Logout"
            aria-label="Logout"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

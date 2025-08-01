import { FaComments, FaBars } from "react-icons/fa";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import LogoutButton from "./LogoutButton";
import authStore from "../../store/auth.store";

function Navbar({ user, onToggleSidebar }) {
  const { logout } = authStore();

  return (
    <nav className="navbar">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="md:hidden mr-2"
        aria-label="Open contacts"
      >
        <FaBars size={18} />
      </Button>

      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <FaComments size={16} />
        </div>
        <span className="hidden sm:inline">ChatApp</span>
      </div>

      {user && (
        <div className="navbar-actions">
          <div className="hidden sm:block text-right mr-3">
            <div className="text-sm font-semibold truncate max-w-[120px]">
              {user.username}
            </div>
            <div className="text-xs opacity-75 flex items-center gap-1">
              <div className="status-indicator" />
              Online
            </div>
          </div>
          
          <Avatar username={user.username} size="sm" />
          
          <LogoutButton onLogout={logout} />
        </div>
      )}
    </nav>
  );
}

export default Navbar;

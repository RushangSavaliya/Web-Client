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
                aria-label="Menu"
            >
                <FaBars size={16} />
            </button>

            <div className="navbar-brand">
                <div className="navbar-brand-icon">
                    <FaComments size={14} />
                </div>
                <span className="hidden sm:inline">Chat</span>
            </div>

            {user && (
                <div className="navbar-actions">
                    <span className="hidden md:inline text-sm font-medium">{user.username}</span>

                    <Avatar username={user.username} size="sm" />

                    <button
                        onClick={logout}
                        className="btn btn-ghost"
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

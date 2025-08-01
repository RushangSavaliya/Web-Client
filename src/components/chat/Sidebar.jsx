import { useEffect, useCallback } from "react";
import { FiCircle, FiMessageCircle, FiUsers, FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import authStore from "../../store/auth.store";
import socket from "../../lib/socket";
import axiosInstance from "../../lib/axios";
import useUserStore from "../../store/user.store";

function Sidebar({ isOpen, selectedUserId, onSelectUser, onClose }) {
  const { user: currentUser } = authStore();
  const { allUsers, setAllUsers, onlineUsers, setOnlineUsers } = useUserStore();

  // Fetch all users
  useEffect(() => {
    axiosInstance
      .get("/users")
      .then((res) => setAllUsers(res.data.users))
      .catch(console.error);
  }, [setAllUsers]);

  // Listen to online users
  useEffect(() => {
    socket.on("active-users", setOnlineUsers);
    return () => socket.off("active-users");
  }, [setOnlineUsers]);

  const isOnline = useCallback(
    (id) => onlineUsers.some((u) => u._id === id),
    [onlineUsers]
  );

  const isSelf = useCallback(
    (id) => currentUser?._id === id,
    [currentUser]
  );

  // Get sorted user list
  const getSortedUsers = () => {
    const merged = [...allUsers];

    // Add self if not included
    if (currentUser && !merged.some((u) => u._id === currentUser._id)) {
      merged.unshift(currentUser);
    }

    // Sort: self → online → offline
    return merged.sort((a, b) => {
      if (a._id === currentUser?._id) return -1;
      if (b._id === currentUser?._id) return 1;
      const aOnline = isOnline(a._id) ? 1 : 0;
      const bOnline = isOnline(b._id) ? 1 : 0;
      return bOnline - aOnline;
    });
  };

  const handleUserSelect = (user) => {
    onSelectUser(user);
  };

  const handleKeyDown = (e, user) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUserSelect(user);
    }
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      aria-label="Contacts sidebar"
    >
      <div className="sidebar-header">
        <div className="sidebar-title">
          <div className="navbar-brand-icon">
            <FiUsers size={16} />
          </div>
          <span>Contacts</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="md:hidden"
          aria-label="Close contacts"
        >
          <FiX size={18} />
        </Button>
      </div>

      <div className="sidebar-content">
        <div className="contact-list">
          {getSortedUsers().map((user) => {
            const online = isOnline(user._id);
            const self = isSelf(user._id);
            const active = selectedUserId === user._id;

            return (
              <div
                key={user._id}
                className={`contact-item ${active ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
                onKeyDown={(e) => handleKeyDown(e, user)}
                tabIndex={0}
                role="button"
                aria-pressed={active}
              >
                <div className="relative">
                  <Avatar 
                    username={user.username} 
                    className={active ? "!bg-white !text-primary" : ""} 
                  />
                  {self && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <FiMessageCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="contact-info">
                  <div className="contact-name">
                    {user.username} {self && "(You)"}
                  </div>
                  <div className="contact-status">
                    <FiCircle 
                      className={`status-indicator ${online ? "" : "offline"}`} 
                    />
                    {online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer md:hidden">
        <p className="text-xs text-center opacity-75">
          Tap a contact to start chatting
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

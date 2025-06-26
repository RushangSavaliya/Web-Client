// File: src/pages/HomePage.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaComments, FaTimes, FaUsers } from "react-icons/fa";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import UserList from "../components/UserList";
import axiosInstance from "../lib/axios";
import socket from "../lib/socket";
import authStore from "../store/auth.store";

// =======================
// HomePage Component
// =======================
export default function HomePage() {
  // ====== State & Store ======
  const { user } = authStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ====== Load Messages when User Selected ======
  useEffect(() => {
    if (!selectedUser) return;
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
        setMessages(res.data.messages);
      } catch (error) {
        toast.error("Failed to load messages: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [selectedUser]);

  // ====== Listen for Incoming Messages ======
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (selectedUser && msg.sender === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("newMessage");
  }, [selectedUser]);

  // ====== Handlers ======
  const handleSend = (newMsg) => setMessages((prev) => [...prev, newMsg]);
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSidebarOpen(false);
  };

  // =======================
  // Render
  // =======================
  return (
    <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] relative bg-base-100">
      {/* ====== Sidebar Overlay (Mobile) ====== */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* ====== Sidebar: User List ====== */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-80 sm:w-96 border-r border-base-300 bg-base-100 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <UserList
          onSelect={handleUserSelect}
          activeUserId={selectedUser?._id}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ====== Main Chat Area ====== */}
      <main className="flex-1 flex flex-col min-w-0">
        {selectedUser ? (
          <>
            {/* ====== Chat Header ====== */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                {/* Open Sidebar (Mobile) */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn btn-ghost btn-sm md:hidden"
                  aria-label="Open contacts"
                >
                  <FaBars className="w-5 h-5" />
                </button>
                {/* User Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-semibold shrink-0">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h2 className="text-base font-medium text-base-content truncate">
                      {selectedUser.username}
                      {selectedUser._id === user._id && " (You)"}
                    </h2>
                    <p className="text-xs text-base-content/60">
                      {selectedUser._id === user._id
                        ? "Personal Chat"
                        : "Online"}
                    </p>
                  </div>
                </div>
                {/* Close Chat (Mobile) */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-ghost btn-sm md:hidden"
                  aria-label="Back to contacts"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* ====== Chat Messages ====== */}
            <div className="flex-1 overflow-hidden bg-base-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="loading loading-dots loading-md text-primary" />
                </div>
              ) : (
                <ChatBox messages={messages} currentUser={user} />
              )}
            </div>

            {/* ====== Message Input ====== */}
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
          </>
        ) : (
          // ====== Empty State (No User Selected) ======
          <div className="flex-1 flex items-center justify-center px-4 bg-base-100">
            <div className="text-center max-w-sm">
              {/* Open Sidebar Button (Mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn btn-primary mb-6 md:hidden"
              >
                <FaUsers className="w-5 h-5 mr-2" />
                View Users
              </button>
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-base-300 flex items-center justify-center text-2xl text-primary">
                <FaComments className="w-6 h-6" />
              </div>
              {/* Instructions */}
              <h2 className="text-lg font-semibold text-base-content mb-1">
                Start a conversation
              </h2>
              <p className="text-sm text-base-content/60">
                <span className="hidden md:inline">
                  Select a user from the sidebar to begin chatting.
                </span>
                <span className="md:hidden">
                  Tap &ldquo;View Users&rdquo; to choose someone.
                </span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

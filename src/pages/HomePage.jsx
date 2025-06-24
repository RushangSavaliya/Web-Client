import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import socket from "../lib/socket";
import authStore from "../store/auth.store";

import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import UserList from "../components/UserList";

export default function HomePage() {
  const { user } = authStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load message history
  useEffect(() => {
    if (!selectedUser) return;
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [selectedUser]);

  // Real-time listener
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (selectedUser && msg.sender === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [selectedUser]);

  const handleSend = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSidebarOpen(false); // Close sidebar on mobile when user is selected
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-80 sm:w-96 md:w-80 lg:w-96
        border-r border-base-300 bg-base-100
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <UserList
          onSelect={handleUserSelect}
          activeUserId={selectedUser?._id}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-base-50 min-w-0">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-100 shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn btn-ghost btn-sm p-2 md:hidden"
                  aria-label="Open contacts"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-medium shrink-0">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-medium text-base-content text-sm sm:text-base truncate">
                      {selectedUser.username}
                    </h2>
                    <p className="text-xs text-base-content/60">Online</p>
                  </div>
                </div>

                {/* Back Button (Mobile) */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-ghost btn-sm p-2 md:hidden"
                  aria-label="Back to contacts"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-hidden min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              ) : (
                <ChatBox messages={messages} currentUser={user} />
              )}
            </div>

            {/* Message Input */}
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
          </>
        ) : (
          /* Welcome State */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              {/* Mobile Menu Button for Welcome State */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="btn btn-primary mb-6 md:hidden"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                View Contacts
              </button>

              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-base-300 flex items-center justify-center text-xl sm:text-2xl mb-4 mx-auto">
                💬
              </div>
              <h2 className="text-lg sm:text-xl font-medium text-base-content mb-2">
                Start a conversation
              </h2>
              <p className="text-base-content/60 text-sm">
                <span className="hidden md:inline">
                  Select a contact from the sidebar to begin messaging
                </span>
                <span className="md:hidden">
                  Tap "View Contacts" to choose someone to chat with
                </span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

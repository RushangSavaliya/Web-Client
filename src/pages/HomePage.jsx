import { useEffect, useState } from "react";
import { Menu, X, Users } from "lucide-react";
import toast from "react-hot-toast";
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
        toast.error("Failed to load messages. Please try again.");
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
    <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] relative">
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
                  <Menu className="w-5 h-5" />
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-medium shrink-0">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-medium text-base-content text-sm sm:text-base truncate">
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

                {/* Back Button (Mobile) */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-ghost btn-sm p-2 md:hidden"
                  aria-label="Back to contacts"
                >
                  <X className="w-5 h-5" />
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
                <Users className="w-5 h-5 mr-2" />
                View Users
              </button>

              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-base-300 flex items-center justify-center text-xl sm:text-2xl mb-4 mx-auto">
                💬
              </div>
              <h2 className="text-lg sm:text-xl font-medium text-base-content mb-2">
                Start a conversation
              </h2>
              <p className="text-base-content/60 text-sm">
                <span className="hidden md:inline">
                  Select a user from the sidebar to begin messaging
                </span>
                <span className="md:hidden">
                  Tap "View Users" to choose someone to chat with
                </span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

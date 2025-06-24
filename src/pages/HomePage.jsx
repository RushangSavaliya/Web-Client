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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-80 border-r border-base-300 bg-base-100">
        <UserList onSelect={setSelectedUser} activeUserId={selectedUser?._id} />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-base-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <header className="px-6 py-4 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-medium">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-medium text-base-content">
                    {selectedUser.username}
                  </h2>
                  <p className="text-xs text-base-content/60">Online</p>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-2xl mb-4 mx-auto">
                💬
              </div>
              <h2 className="text-xl font-medium text-base-content mb-2">
                Start a conversation
              </h2>
              <p className="text-base-content/60 text-sm">
                Select a contact from the sidebar to begin messaging
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

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
    <div className="flex h-[calc(100vh-4rem)] bg-base-200">
      {/* User List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-base-300 bg-base-100 shadow-lg">
        <UserList onSelect={setSelectedUser} activeUserId={selectedUser?._id} />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 bg-base-100">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-base-300 bg-base-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content w-10 rounded-full">
                    <span className="text-sm font-semibold">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">
                    {selectedUser.username}
                  </h3>
                  <p className="text-sm text-base-content/60 flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : (
                <ChatBox messages={messages} currentUser={user} />
              )}
            </div>

            {/* Message Input */}
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-base-200 to-base-100 p-8">
            <div className="text-center space-y-6 max-w-md">
              <div className="chat-image avatar placeholder">
                <div className="bg-primary text-primary-content w-24 rounded-full">
                  <span className="text-4xl">💬</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-base-content">
                  Welcome to ChatApp
                </h2>
                <p className="text-base-content/60">
                  Select a user from the sidebar to start chatting
                </p>
              </div>
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Your messages are end-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

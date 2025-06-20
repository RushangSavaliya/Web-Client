// File: src/pages/HomePage.jsx

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

  // Load message history
  useEffect(() => {
    if (!selectedUser) return;
    const loadMessages = async () => {
      const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
      setMessages(res.data.messages);
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      <UserList onSelect={setSelectedUser} activeUserId={selectedUser?._id} />
      <div className="flex flex-col flex-1 bg-base-100">
        {selectedUser ? (
          <>
            <ChatBox messages={messages} currentUser={user} />
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { BsChatDots } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import axiosInstance from "../../lib/axios";
import socket from "../../lib/socket";
import authStore from "../../store/auth.store";

function ChatArea({ selectedUser, onBack }) {
  const { user } = authStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
        setMessages(res.data.messages);
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  // Empty state when no user is selected
  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div className="empty-state">
          <div className="empty-state-icon">
            <BsChatDots />
          </div>
          <h2 className="empty-state-title">Start a conversation</h2>
          <p className="empty-state-description">
            Select a contact from the sidebar to begin chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <header className="chat-header">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden mr-3"
          aria-label="Go back to contacts"
        >
          <FiArrowLeft size={18} />
        </Button>

        <Avatar username={selectedUser.username} />
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">
            {selectedUser.username}
          </h2>
          <p className="text-xs opacity-75 flex items-center gap-1">
            <div className="status-indicator" />
            Online
          </p>
        </div>
      </header>

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentUserId={user._id}
        chatEndRef={chatEndRef}
      />

      {/* Message Input */}
      <MessageInput
        receiverId={selectedUser._id}
        onSent={handleSendMessage}
      />
    </div>
  );
}

export default ChatArea;

// File: src/components/home/ChatArea.jsx

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { BsChatDots } from "react-icons/bs";
import axiosInstance from "../../lib/axios";
import socket from "../../lib/socket";
import authStore from "../../store/auth.store";

import ChatHeader from "./modules/ChatHeader";
import MessageList from "./modules/MessageList";
import MessageInput from "./modules/MessageInput";

/**
 * ChatArea component handles the main chat UI and logic.
 */
function ChatArea({ selectedUser, onBack }) {
    // ====== State and Refs ======
    const { user } = authStore();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // ====== Fetch Messages When User Changes ======
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

    // ====== Listen for Incoming Messages via Socket ======
    useEffect(() => {
        const handleNewMessage = (msg) => {
            // Only add messages relevant to the current chat
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

    // ====== Handle Sending a New Message ======
    const handleSend = (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
    };

    // ====== Render: No User Selected ======
    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center px-4 chat-area">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-telegram-elevated flex items-center justify-center text-2xl" style={{color: 'var(--color-primary)'}}>
                        <BsChatDots className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-telegram-primary mb-1">
                        Start a conversation
                    </h2>
                    <p className="text-sm text-telegram-secondary">
                        Select a user from the sidebar to begin chatting.
                    </p>
                </div>
            </div>
        );
    }

    // ====== Render: Chat Area ======
    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Chat header with user info and back button */}
            <ChatHeader user={selectedUser} onBack={onBack} />

            {/* List of messages */}
            <MessageList
                messages={messages}
                isLoading={isLoading}
                currentUserId={user._id}
                chatEndRef={chatEndRef}
            />

            {/* Input for sending new messages */}
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
        </div>
    );
}

export default ChatArea;

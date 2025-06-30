// File: src/components/home/ChatArea.jsx

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { BsChatDots } from "react-icons/bs"; // ✅ replaced <i> with this
import axiosInstance from "../../lib/axios";
import socket from "../../lib/socket";
import authStore from "../../store/auth.store";

import ChatHeader from "./modules/ChatHeader";
import MessageList from "./modules/MessageList";
import MessageInput from "./modules/MessageInput";

function ChatArea({ selectedUser, setSelectedUser }) {
    const { user } = authStore();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

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

    const handleSend = (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
    };

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center px-4 bg-base-100">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-base-300 flex items-center justify-center text-2xl text-primary">
                        <BsChatDots className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-base-content mb-1">
                        Start a conversation
                    </h2>
                    <p className="text-sm text-base-content/60">
                        Select a user from the sidebar to begin chatting.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            <ChatHeader user={selectedUser} onBack={() => setSelectedUser(null)} />
            <MessageList
                messages={messages}
                isLoading={isLoading}
                currentUserId={user._id}
                chatEndRef={chatEndRef}
            />
            <MessageInput receiverId={selectedUser._id} onSent={handleSend} />
        </div>
    );
}

export default ChatArea;

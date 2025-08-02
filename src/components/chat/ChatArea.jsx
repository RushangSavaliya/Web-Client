import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { BsChatDots } from "react-icons/bs";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    if (!selectedUser) {
        return (
            <div className="chat-area">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <BsChatDots />
                    </div>
                    <h2 className="empty-state-title">Select a chat to start messaging</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-area">
            <header className="chat-header">
                <button
                    onClick={onBack}
                    className="btn btn-ghost md:hidden"
                    aria-label="Back"
                >
                    <FiArrowLeft size={18} />
                </button>

                <Avatar username={selectedUser.username} />

                <div className="flex-1 min-w-0">
                    <div className="contact-name">{selectedUser.username}</div>
                    <div className="contact-status">
                        <div className="status-indicator" />
                        online
                    </div>
                </div>

                <button className="btn btn-ghost" aria-label="More options">
                    <FiMoreVertical size={18} />
                </button>
            </header>

            <MessageList
                messages={messages}
                isLoading={isLoading}
                currentUserId={user._id}
                chatEndRef={chatEndRef}
            />

            <MessageInput
                receiverId={selectedUser._id}
                onSent={handleSendMessage}
            />
        </div>
    );
}

export default ChatArea;

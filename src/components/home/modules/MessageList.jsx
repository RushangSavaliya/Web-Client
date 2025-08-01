// File: src/components/home/modules/MessageList.jsx

import MessageBubble from "./MessageBubble";
import { BsChatDots } from "react-icons/bs";

function MessageList({ messages, isLoading, currentUserId, chatEndRef }) {
    const containerClass =
        "flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 chat-area";

    // Loading state
    if (isLoading) {
        return (
            <div className={containerClass}>
                <div className="flex justify-center items-center h-full">
                    <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!messages.length) {
        return (
            <div className={containerClass}>
                <div className="flex items-center justify-center h-full min-h-[200px]">
                    <div className="text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-telegram-elevated flex items-center justify-center text-xl mb-3 mx-auto">
                            <BsChatDots />
                        </div>
                        <p className="text-base text-telegram-secondary">
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <div className="space-y-3 sm:space-y-4 pb-4">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg._id}
                        message={msg}
                        isOwn={msg.sender === currentUserId}
                    />
                ))}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
}

export default MessageList;

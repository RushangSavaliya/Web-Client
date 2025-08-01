// File: src/components/home/modules/MessageList.jsx

import MessageBubble from "./MessageBubble";
import { BsChatDots } from "react-icons/bs";

function MessageList({ messages, isLoading, currentUserId, chatEndRef }) {
    const containerClass =
        "flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-gray-25 dark:bg-gray-850";

    // Loading state
    if (isLoading) {
        return (
            <div className={containerClass}>
                <div className="flex justify-center items-center h-full">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
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
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl mb-3 mx-auto">
                            <BsChatDots />
                        </div>
                        <p className="text-base text-gray-500 dark:text-gray-400">
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

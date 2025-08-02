import { BsChatDots } from "react-icons/bs";
import MessageBubble from "./MessageBubble";

function MessageList({ messages, isLoading, currentUserId, chatEndRef }) {
    if (isLoading) {
        return (
            <div className="chat-messages">
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

    if (!messages.length) {
        return (
            <div className="chat-messages">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <BsChatDots />
                    </div>
                    <h3 className="empty-state-title">No messages</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-messages">
            {messages.map((message) => (
                <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender === currentUserId}
                />
            ))}
            <div ref={chatEndRef} />
        </div>
    );
}

export default MessageList;

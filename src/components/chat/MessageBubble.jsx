// File: src/components/chat/MessageBubble.jsx

function MessageBubble({ message, isOwn }) {
    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className={`message ${isOwn ? "sent" : "received"}`}>
            <div className={`message-bubble ${isOwn ? "sent" : "received"}`}>
                {message.content}
                <div className="message-time">
                    {formatTime(message.createdAt)}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;

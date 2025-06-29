// File: src/components/MessageBubble.jsx

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
      {/* Sender name for others only */}
      {!isOwn && (
        <div className="chat-header text-sm font-semibold text-base-content">
          {message.senderName}
        </div>
      )}

      {/* Chat bubble with message and timestamp inside */}
      <div
        className={`chat-bubble max-w-xs sm:max-w-sm md:max-w-md break-words whitespace-pre-wrap px-4 py-2 text-sm sm:text-base flex flex-col gap-1 ${isOwn
            ? "chat-bubble-primary text-primary-content"
            : "chat-bubble-neutral text-neutral-content"
          }`}
      >
        {/* Message content */}
        <div>{message.content}</div>

        {/* Timestamp in footer-style inside bubble */}
        <div className="text-right text-[10px] sm:text-xs opacity-60">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

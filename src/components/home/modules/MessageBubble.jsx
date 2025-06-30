// File: src/components/MessageBubble.jsx

// =======================
// MessageBubble Component
// =======================

function MessageBubble({ message, isOwn }) {
  // Format timestamp to HH:MM
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Bubble style based on sender
  const bubbleClass = isOwn
    ? "chat-bubble-primary text-primary-content"
    : "chat-bubble-neutral text-neutral-content";

  return (
    <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
      {/* Show sender name for received messages */}
      {!isOwn && (
        <div className="chat-header text-sm font-semibold text-base-content">
          {message.senderName}
        </div>
      )}

      <div
        className={[
          "chat-bubble",
          "max-w-xs sm:max-w-sm md:max-w-md",
          "break-words whitespace-pre-wrap",
          "px-4 py-2",
          "text-sm sm:text-base",
          "flex flex-col gap-1",
          bubbleClass,
        ].join(" ")}
      >
        {/* Message Content */}
        <div>{message.content}</div>
        {/* Timestamp */}
        <div className="text-right text-[10px] sm:text-xs opacity-60">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;

// File: src/components/MessageBubble.jsx

function MessageBubble({ message, isOwn }) {
  // Format timestamp to HH:MM
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Bubble style based on sender
  const bubbleClass = isOwn
    ? "bg-blue-600 text-white"
    : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={[
          "rounded-2xl shadow-sm",
          "max-w-xs sm:max-w-sm md:max-w-md",
          "break-words whitespace-pre-wrap",
          "px-4 py-2",
          "text-sm sm:text-base",
          "flex flex-col gap-1",
          bubbleClass,
          isOwn ? "rounded-br-md" : "rounded-bl-md",
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

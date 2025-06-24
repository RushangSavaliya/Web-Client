export default function MessageBubble({ message, isOwn, showAvatar }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      {/* Avatar (only for received messages) */}
      {!isOwn && (
        <div
          className={`w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-xs font-medium ${
            showAvatar ? "opacity-100" : "opacity-0"
          }`}
        >
          {showAvatar ? message.senderName?.charAt(0).toUpperCase() || "U" : ""}
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-xs sm:max-w-sm ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-primary text-primary-content"
              : "bg-base-200 text-base-content"
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>

        {showAvatar && (
          <div className={`mt-1 px-1 ${isOwn ? "text-right" : "text-left"}`}>
            <span className="text-xs text-base-content/50">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Spacer for sent messages */}
      {isOwn && <div className="w-8"></div>}
    </div>
  );
}

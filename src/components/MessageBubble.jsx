export default function MessageBubble({
  message,
  isOwn,
  isFirstFromSender,
  isLastFromSender,
}) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`message-bubble flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for received messages */}
      {!isOwn && isLastFromSender && (
        <div className="avatar placeholder mb-1">
          <div className="bg-primary text-primary-content w-8 rounded-full">
            <span className="text-xs font-semibold">
              {message.senderName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
      )}

      {/* Spacer when not showing avatar */}
      {!isOwn && !isLastFromSender && <div className="w-8"></div>}

      {/* Message Content */}
      <div
        className={`message-content max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ${
          isOwn ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {/* Message Bubble */}
        <div
          className={`message-text px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
            isOwn
              ? "bg-primary text-primary-content rounded-2xl rounded-br-md"
              : "bg-base-200 text-base-content rounded-2xl rounded-bl-md border border-base-300"
          }`}
        >
          <p className="break-words leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp */}
        {isLastFromSender && (
          <div
            className={`message-time mt-1 px-2 ${
              isOwn ? "text-right" : "text-left"
            }`}
          >
            <span className="text-xs text-base-content/50">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Avatar for sent messages */}
      {isOwn && isLastFromSender && (
        <div className="avatar placeholder mb-1">
          <div className="bg-primary text-primary-content w-8 rounded-full">
            <span className="text-xs font-semibold">
              {message.senderName?.charAt(0).toUpperCase() || "Y"}
            </span>
          </div>
        </div>
      )}

      {/* Spacer when not showing avatar */}
      {isOwn && !isLastFromSender && <div className="w-8"></div>}
    </div>
  );
}

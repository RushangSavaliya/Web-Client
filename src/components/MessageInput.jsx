import { useState } from "react";
import axiosInstance from "../lib/axios";

export default function MessageInput({ receiverId, onSent }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await axiosInstance.post("/messages", {
        receiverId,
        content,
      });
      onSent(res.data.message);
      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 sm:p-6 border-t border-base-300 bg-base-100 shrink-0">
      <div className="flex gap-2 sm:gap-3 items-end">
        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="input input-bordered w-full text-sm sm:text-base h-10 sm:h-12"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            autoComplete="off"
            autoCapitalize="sentences"
            autoCorrect="on"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="btn btn-primary btn-circle h-10 w-10 sm:h-12 sm:w-12 min-h-10 sm:min-h-12 shrink-0"
          aria-label="Send message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Helper Text */}
      <div className="mt-2 sm:hidden">
        <p className="text-xs text-base-content/40 text-center">
          {content.length > 0
            ? `${content.length} characters`
            : "Enter to send"}
        </p>
      </div>
    </div>
  );
}

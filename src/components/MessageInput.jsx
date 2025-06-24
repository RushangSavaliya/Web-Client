import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

// MessageInput component for sending messages
export default function MessageInput({ receiverId, onSent }) {
  // --- State Management ---
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  // --- Send Message Handler ---
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
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // --- Keyboard Handler (Enter to Send) ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Render ---
  return (
    <div className="p-4 sm:p-6 border-t border-base-300 bg-base-100 shrink-0">
      <div className="flex gap-2 sm:gap-3 items-end">
        {/* --- Text Input --- */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="input input-bordered w-full text-sm sm:text-base h-10 sm:h-11 md:h-12"
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

        {/* --- Send Button --- */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="btn btn-primary btn-circle h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-h-10 sm:min-h-11 md:min-h-12 shrink-0"
          aria-label="Send message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* --- Mobile Helper Text --- */}
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

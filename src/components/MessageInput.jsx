// File: src/components/MessageInput.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import axiosInstance from "../lib/axios";

// MessageInput component: input box and send button for sending messages
export default function MessageInput({ receiverId, onSent }) {
  // -------------------- State --------------------
  const [content, setContent] = useState(""); // Message content
  const [isSending, setIsSending] = useState(false); // Sending state

  // -------------------- Handlers --------------------

  // Send message to server
  const handleSend = async () => {
    if (!content.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await axiosInstance.post("/messages", {
        receiverId,
        content,
      });
      onSent(res.data.message); // Notify parent on success
      setContent(""); // Clear input
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key for sending
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="border-t border-base-300 bg-base-100 p-4 sm:p-6">
      <div className="flex items-end gap-2 sm:gap-3">
        {/* Input Field */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
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
          className="btn btn-primary btn-circle h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 min-h-10 sm:min-h-11 md:min-h-12"
          aria-label="Send Message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

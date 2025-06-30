// File: src/components/MessageInput.jsx

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import axiosInstance from "../../../lib/axios";

function MessageInput({ receiverId, onSent }) {
  // State
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs
  const inputRef = useRef(null);
  const shouldRefocus = useRef(false);

  // Focus input on mount and after send/clear
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (shouldRefocus.current) {
      inputRef.current?.focus();
      shouldRefocus.current = false;
    }
  }, [content]);

  // Send message
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
      shouldRefocus.current = true;
    } catch {
      toast.error("Failed to send message. Please try again.");
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    } finally {
      setIsSending(false);
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      setContent("");
      shouldRefocus.current = true;
    }
  };

  // Classes
  const buttonSize = "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12";
  const inputClass = [
    "input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base",
    hasError ? "input-error" : "",
  ].join(" ");

  return (
    <div className="border-t border-base-300 bg-base-100 p-4 sm:p-6">
      <div className="flex items-end gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            className={inputClass}
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            autoComplete="off"
            autoCapitalize="sentences"
            autoCorrect="on"
            aria-disabled={isSending}
            inputMode="text"
            enterKeyHint="send"
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className={`btn btn-primary btn-circle min-h-0 ${buttonSize}`}
          aria-label="Send Message"
          aria-disabled={isSending}
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

export default MessageInput;

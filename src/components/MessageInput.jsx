// File: src/components/MessageInput.jsx

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import axiosInstance from "../lib/axios";

/**
 * MessageInput component
 * Allows user to type and send a message to a receiver.
 * Handles sending state, error display, and input focus management.
 */
export default function MessageInput({ receiverId, onSent }) {
  // State for message content, sending status, and error
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs for input focus management
  const inputRef = useRef(null);
  const shouldRefocus = useRef(false);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Refocus input after sending or clearing
  useEffect(() => {
    if (shouldRefocus.current) {
      inputRef.current?.focus();
      shouldRefocus.current = false;
    }
  }, [content]);

  /**
   * Handles sending the message.
   * Calls API, manages UI state, and notifies parent on success.
   */
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
      setHasError(true);
      toast.error("Failed to send message");
      setTimeout(() => setHasError(false), 2000);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Handles keyboard shortcuts:
   * - Enter: send message (unless Shift is held)
   * - Escape: clear input
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape") {
      setContent("");
      shouldRefocus.current = true;
    }
  };

  return (
    <div className="border-t border-base-300 bg-base-100 p-4 sm:p-6">
      <div className="flex items-end gap-3">
        {/* Message Input Field */}
        <label
          className={`input input-bordered validator flex-1 ${hasError ? "input-error" : ""
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            className="grow h-10 sm:h-11 md:h-12 text-sm sm:text-base"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            autoComplete="off"
            autoCapitalize="sentences"
            autoCorrect="on"
            inputMode="text"
            enterKeyHint="send"
            aria-disabled={isSending}
          />
        </label>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="btn btn-primary btn-circle min-h-0 h-11 w-11 md:h-12 md:w-12"
          aria-label="Send Message"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="text-error text-xs mt-2 ml-1 validator-hint">
          Could not send message. Try again.
        </p>
      )}
    </div>
  );
}


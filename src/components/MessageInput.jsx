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
      // You might want to show a toast error here
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
    <div className="message-input-container border-t border-base-300 bg-base-100 p-4 shadow-lg">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Text Input Area */}
        <div className="flex-1 min-w-0">
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered resize-none min-h-[2.5rem] max-h-32 leading-6 py-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              rows={1}
              disabled={isSending}
              style={{
                height: "auto",
                overflowY: content.split("\n").length > 3 ? "scroll" : "hidden",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>
        </div>

        {/* Send Button */}
        <button
          className={`btn btn-primary btn-circle ${isSending ? "loading" : ""}`}
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          title="Send message (Enter)"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

      {/* Character count or typing indicator could go here */}
      <div className="text-center mt-2">
        <p className="text-xs text-base-content/40">
          {content.length > 0
            ? `${content.length} characters`
            : "Press Enter to send • Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
}

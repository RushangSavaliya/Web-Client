import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import axiosInstance from "../../lib/axios";

function MessageInput({ receiverId, onSent }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const res = await axiosInstance.post("/messages", {
        receiverId,
        content: content.trim(),
      });
      onSent(res.data.message);
      setContent("");
      inputRef.current?.focus();
    } catch {
      toast.error("Failed to send message");
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
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <input
          ref={inputRef}
          className="input"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="btn btn-primary btn-circle"
          aria-label="Send"
        >
          {isSending ? (
            <div className="loading-spinner" />
          ) : (
            <FiSend size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import Button from "../ui/Button";
import axiosInstance from "../../lib/axios";

function MessageInput({ receiverId, onSent }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const inputRef = useRef(null);
  const shouldRefocus = useRef(false);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Refocus after sending
  useEffect(() => {
    if (shouldRefocus.current) {
      inputRef.current?.focus();
      shouldRefocus.current = false;
    }
  }, [content]);

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
      shouldRefocus.current = true;
    } catch {
      toast.error("Failed to send message. Please try again.");
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    } finally {
      setIsSending(false);
    }
  };

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

  const handleChange = (e) => {
    setContent(e.target.value);
    if (hasError) setHasError(false);
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          className={`input resize-none ${hasError ? "input-error" : ""}`}
          placeholder="Type a message..."
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          rows={1}
          style={{
            minHeight: "44px",
            maxHeight: "120px",
            height: "44px",
            overflowY: content.length > 50 ? "auto" : "hidden",
          }}
          autoComplete="off"
          autoCapitalize="sentences"
          autoCorrect="on"
          enterKeyHint="send"
        />
        
        <Button
          variant="primary"
          size="circle"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          loading={isSending}
          aria-label="Send message"
          className="flex-shrink-0"
        >
          {!isSending && <FiSend size={16} />}
        </Button>
      </div>
    </div>
  );
}

export default MessageInput;

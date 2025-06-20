// File: src/components/ChatBox.jsx

import { useState } from "react";
import axiosInstance from "../lib/axios";

export default function MessageInput({ receiverId, onSent }) {
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (!content.trim()) return;
    const res = await axiosInstance.post("/messages", { receiverId, content });
    onSent(res.data.message);
    setContent("");
  };

  return (
    <div className="flex gap-2 p-3 border-t bg-base-100">
      <input
        className="input input-bordered w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
      />
      <button className="btn btn-primary" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

// File: src/components/ChatBox.jsx

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages, currentUser }) {
  const chatEndRef = useRef();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-base-200 to-base-100 rounded-lg shadow-lg border border-base-300">
      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-center text-base-content/60 italic mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender === currentUser._id}
            />
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

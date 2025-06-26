// File: src/components/ChatBox.jsx

import { useEffect, useRef } from "react";
import { BsChatDots } from "react-icons/bs";
import MessageBubble from "./MessageBubble";

// =======================
// ChatBox
// =======================

export default function ChatBox({ messages, currentUser }) {
  const chatEndRef = useRef();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =======================
  // Empty State
  // =======================
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain bg-base-50">
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center px-4">
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-xl mb-3 mx-auto">
              <BsChatDots />
            </div>
            <p className="text-base text-base-content/60">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =======================
  // Messages List
  // =======================
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain bg-base-50">
      <div className="space-y-3 sm:space-y-4 pb-4">
        {messages.map((msg, index) => {
          const showAvatar =
            index === 0 || messages[index - 1].sender !== msg.sender;
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender === currentUser._id}
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

// File: src/components/ChatBox.jsx

import { useEffect, useRef } from "react";
import { BsChatDots } from "react-icons/bs";
import MessageBubble from "./MessageBubble";

/**
 * ChatBox Component
 * -----------------
 * Renders the chat message area with automatic scrolling and empty state.
 *
 * Props:
 * - messages: Array of message objects
 * - currentUser: Current user object
 */
export default function ChatBox({ messages, currentUser }) {
  // =========================
  //   Refs & Auto-Scrolling
  // =========================
  const chatEndRef = useRef();

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  //   Styles
  // =========================
  const containerClass =
    "flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-base-50";

  // =========================
  //   Empty State
  // =========================
  if (messages.length === 0) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center px-4">
            {/* Chat icon */}
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-xl mb-3 mx-auto">
              <BsChatDots />
            </div>
            {/* Empty state message */}
            <p className="text-base text-base-content/60">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  //   Messages List
  // =========================
  return (
    <div className={containerClass}>
      <div className="space-y-3 sm:space-y-4 pb-4">
        {/* Render each message bubble */}
        {messages.map((msg, index) => {
          // Show avatar if it's the first message or sender changed
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
        {/* Dummy div for auto-scroll to bottom */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}


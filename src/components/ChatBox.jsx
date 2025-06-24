import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

// ChatBox component: displays chat messages and handles auto-scrolling
export default function ChatBox({ messages, currentUser }) {
  // Reference to the end of the chat for scrolling
  const chatEndRef = useRef();

  // Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    // Main chat container
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
      {/* Section: Empty state when there are no messages */}
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-300 flex items-center justify-center text-lg sm:text-xl mb-3 mx-auto">
              💭
            </div>
            <p className="text-base-content/60 text-sm sm:text-base">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        // Section: Render list of messages
        <div className="space-y-3 sm:space-y-4 pb-4">
          {messages.map((msg, index) => {
            // Section: Determine if avatar should be shown
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
          {/* Section: Dummy div for scroll-to-bottom */}
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  );
}

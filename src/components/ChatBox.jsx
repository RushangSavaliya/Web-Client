import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages, currentUser }) {
  const chatEndRef = useRef();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
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
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages, currentUser }) {
  const chatEndRef = useRef();
  const chatContainerRef = useRef();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="chat-container flex-1 overflow-y-auto p-4 bg-gradient-to-b from-base-200/30 to-base-100 scroll-smooth"
    >
      <div className="flex flex-col gap-4 min-h-full">
        {messages.length === 0 ? (
          <div className="empty-state flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="chat-image avatar placeholder">
              <div className="bg-base-300 text-base-content w-16 rounded-full">
                <span className="text-2xl">💭</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-base-content">
                No messages yet
              </h3>
              <p className="text-base-content/60 max-w-sm">
                Start the conversation! Send your first message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="messages-list space-y-3 pb-4">
            {messages.map((msg, index) => {
              const isFirstFromSender =
                index === 0 || messages[index - 1].sender !== msg.sender;
              const isLastFromSender =
                index === messages.length - 1 ||
                messages[index + 1].sender !== msg.sender;

              return (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={msg.sender === currentUser._id}
                  isFirstFromSender={isFirstFromSender}
                  isLastFromSender={isLastFromSender}
                />
              );
            })}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

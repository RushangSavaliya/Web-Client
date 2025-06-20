// File: src/components/ChatBox.jsx

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${
          isOwn ? "bg-primary text-white" : "bg-base-200"
        }`}
      >
        <p className="break-words">{message.content}</p>
        <span className="text-xs opacity-70 block mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

// File: src/components/home/modules/ChatHeader.jsx

import UserAvatar from "./UserAvatar"; // ✅ Imported

function ChatHeader({ user }) {
  return (
    <header className="chat-header px-4 sm:px-6 py-3 sm:py-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* User Info Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <UserAvatar username={user.username} size="md" />
          <div className="truncate">
            <h2 className="text-base font-medium truncate">{user.username}</h2>
            <p className="text-xs text-telegram-success">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;

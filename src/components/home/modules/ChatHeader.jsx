// File: src/components/home/modules/ChatHeader.jsx

import UserAvatar from "./UserAvatar"; // ✅ Imported

function ChatHeader({ user }) {
  return (
    <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-100 shrink-0">
      <div className="flex items-center gap-3">
        {/* User Info Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <UserAvatar username={user.username} size="md" />
          <div className="truncate">
            <h2 className="text-base font-medium truncate">{user.username}</h2>
            <p className="text-xs text-base-content/60">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;

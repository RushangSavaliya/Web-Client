// File: src/components/home/modules/ChatHeader.jsx

/**
 * ChatHeader Component
 * Displays the user's avatar, username, and online status in the chat header.
 */

function ChatHeader({ user }) {
    return (
        <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-100 shrink-0">
            <div className="flex items-center gap-3">

                {/* === User Info Section === */}
                <div className="flex items-center gap-3 flex-1 min-w-0">

                    {/* --- User Avatar --- */}
                    <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-semibold shrink-0">
                        {/* Display first letter of username */}
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    {/* --- Username and Status --- */}
                    <div className="truncate">
                        {/* Username */}
                        <h2 className="text-base font-medium truncate">
                            {user.username}
                        </h2>
                        {/* User Status */}
                        <p className="text-xs text-base-content/60">
                            Online
                        </p>
                    </div>
                </div>
                {/* === End User Info Section === */}

            </div>
        </header>
    );
}

export default ChatHeader;


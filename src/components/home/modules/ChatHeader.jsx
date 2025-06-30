// File: src/components/home/modules/ChatHeader.jsx

import { FaTimes } from "react-icons/fa";

function ChatHeader({ user, onBack }) {
    return (
        <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-100 shrink-0">
            <div className="flex items-center gap-3">
                {/* Back Button (Mobile Only) */}
                <button
                    onClick={onBack}
                    className="btn btn-ghost btn-sm md:hidden"
                    aria-label="Back to contacts"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-sm font-semibold shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Username and Status */}
                    <div className="truncate">
                        <h2 className="text-base font-medium truncate">
                            {user.username}
                        </h2>
                        <p className="text-xs text-base-content/60">
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ChatHeader;


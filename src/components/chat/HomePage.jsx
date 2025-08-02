import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import authStore from "../../store/auth.store";

function HomePage() {
    const { user } = authStore();
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when user is selected on mobile
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSidebarOpen(false);
    };

    // Handle back button in chat area (mobile)
    const handleBack = () => {
        setSelectedUser(null);
        setSidebarOpen(true);
    };

    // Close sidebar overlay
    const handleCloseSidebar = () => setSidebarOpen(false);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [sidebarOpen]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [sidebarOpen]);

    return (
        <div className="app">
            <Navbar
                user={user}
                onToggleSidebar={() => setSidebarOpen(true)}
            />

            <div className="main-content">
                {/* Backdrop for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={handleCloseSidebar}
                        aria-hidden="true"
                    />
                )}

                <Sidebar
                    isOpen={sidebarOpen}
                    selectedUserId={selectedUser?._id}
                    onSelectUser={handleSelectUser}
                    onClose={handleCloseSidebar}
                />

                <ChatArea
                    selectedUser={selectedUser}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
}

export default HomePage;

// File: src/pages/HomePage.jsx

import { useState } from "react";
import Navbar from "../components/home/Navbar";
import ChatSidebar from "../components/home/ChatSidebar";
import ChatArea from "../components/home/ChatArea";
import authStore from "../store/auth.store";

// =========================
// HomePage Component
// =========================
function HomePage() {
  // ===== Auth State =====
  const { user } = authStore();

  // ===== Local State =====
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected chat user
  const [sidebarOpen, setSidebarOpen] = useState(false);  // Sidebar open state (for mobile)

  // ===== Handlers =====

  // Handle selecting a user from the sidebar
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  // Handle back button in chat area (mobile)
  const handleBack = () => {
    setSelectedUser(null); // Deselect user
    setSidebarOpen(true);  // Open sidebar
  };

  // Handle closing the sidebar overlay
  const handleCloseSidebar = () => setSidebarOpen(false);

  // ===== Render =====
  return (
    <>
      {/* Navbar */}
      <Navbar
        isLoggedIn={true}
        user={user}
        onLogout={authStore.getState().logout}
        onToggleSidebar={() => setSidebarOpen(true)}
      />

      {/* Main Layout */}
      <div className="fixed inset-x-0 top-[3.5rem] sm:top-[4rem] bottom-0 flex bg-telegram-primary overflow-hidden">
        {/* Sidebar: Chat contacts */}
        <ChatSidebar
          isOpen={sidebarOpen}
          selectedUserId={selectedUser?._id}
          onSelectUser={handleSelectUser}
          onClose={handleCloseSidebar}
        />

        {/* Chat Area: Conversation */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          <ChatArea
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            onBack={handleBack}
          />
        </main>
      </div>
    </>
  );
}

export default HomePage;

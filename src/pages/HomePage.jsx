// File: src/pages/HomePage.jsx

import { useState } from "react";
import Navbar from "../components/home/Navbar";
import ChatSidebar from "../components/home/ChatSidebar";
import ChatArea from "../components/home/ChatArea";
import authStore from "../store/auth.store";

function HomePage() {
  // Auth state
  const { user } = authStore();

  // UI state
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handlers
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSidebarOpen(false);
  };

  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Navbar */}
      <Navbar
        isLoggedIn={true}
        user={user}
        onLogout={authStore.getState().logout}
      />

      {/* Main Layout */}
      <div className="fixed inset-x-0 top-[3.5rem] sm:top-[4rem] bottom-0 flex bg-base-100 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          isOpen={sidebarOpen}
          selectedUserId={selectedUser?._id}
          onSelectUser={handleSelectUser}
          onClose={handleCloseSidebar}
        />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatArea
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </main>
      </div>
    </>
  );
}

export default HomePage;

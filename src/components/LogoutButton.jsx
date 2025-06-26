// File: src/components/LogoutButton.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import axiosInstance from "../lib/axios";

// LogoutButton Component
export default function LogoutButton({ onLogout }) {
  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // Handler for logout action
  const handleLogout = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      // Send logout request to backend
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        // On success: remove token, show toast, call onLogout callback
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        onLogout();
      } else {
        // Handle unexpected response
        toast.error("Logout failed");
      }
    } catch (err) {
      // Handle errors from request
      toast.error(err.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Render logout button
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn btn-ghost btn-sm h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation"
      title="Logout"
      aria-label="Logout"
    >
      {/* Show spinner while loading, otherwise show logout icon */}
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <FiLogOut className="w-4 h-4" />
      )}
    </button>
  );
}

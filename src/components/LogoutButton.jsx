// Import dependencies
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

// LogoutButton component definition
export default function LogoutButton({ onLogout }) {
  // State to track loading status
  const [loading, setLoading] = useState(false);

  // Handler for logout action
  const handleLogout = async () => {
    if (loading) return;
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
        // On failure: show error toast
        toast.error("Logout failed");
        setLoading(false);
      }
    } catch (err) {
      // Handle errors from request
      toast.error(err.response?.data?.error || "Logout failed");
      setLoading(false);
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
      {loading ? (
        // Show loading spinner when logging out
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        // Show logout icon when not loading
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
    </button>
  );
}

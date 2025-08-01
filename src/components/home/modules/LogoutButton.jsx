// File: src/components/home/modules/LogoutButton.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import axiosInstance from "../../../lib/axios";

function LogoutButton({ onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        onLogout();
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation dark:text-gray-300 dark:hover:bg-gray-700"
      title="Logout"
      aria-label="Logout"
    >
      {loading ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <FiLogOut className="w-4 h-4" />
      )}
    </button>
  );
}

export default LogoutButton;

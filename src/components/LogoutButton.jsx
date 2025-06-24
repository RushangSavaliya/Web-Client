import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export default function LogoutButton({ onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return; // block double click
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        onLogout();
      } else {
        toast.error("Logout failed");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Logout failed");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`btn btn-sm btn-error text-white ${loading ? "loading" : ""} hover:btn-error-focus transition-all duration-200`}
      disabled={loading}
      title="Logout"
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Logging out...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </>
      )}
    </button>
  );
}

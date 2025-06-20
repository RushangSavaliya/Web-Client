// File: src/components/LogoutButton.jsx

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
      className="btn btn-sm btn-error text-white"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

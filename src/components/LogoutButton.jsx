// File: src/components/LogoutButton.jsx

import axiosInstance from "../lib/axios";

export default function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/logout");
      if (res.status === 200) {
        localStorage.removeItem("token");
        onLogout();
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-sm btn-error text-white">
      Logout
    </button>
  );
}

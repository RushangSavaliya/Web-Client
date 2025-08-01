import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import Button from "../ui/Button";
import axiosInstance from "../../lib/axios";

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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      loading={loading}
      title="Logout"
      aria-label="Logout"
      className="p-2"
    >
      {!loading && <FiLogOut size={16} />}
    </Button>
  );
}

export default LogoutButton;

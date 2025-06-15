// File: src/components/Navbar.jsx

import { Link } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Navbar({ isLoggedIn, onLogout }) {
  const handleLogout = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) onLogout();
      else console.error("Logout failed");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          ChatApp
        </Link>
      </div>
      <div className="flex-none space-x-2">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-outline">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-error text-white"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

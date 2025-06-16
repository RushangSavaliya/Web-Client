// File: src/components/Navbar.jsx

import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary">
          ChatApp
        </Link>
      </div>

      <div className="flex-none space-x-2">
        {isLoggedIn ? (
          <LogoutButton onLogout={onLogout} />
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

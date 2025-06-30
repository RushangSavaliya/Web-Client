// File: src/App.jsx

// --- Imports ---
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import authStore from "./store/auth.store";

// --- Main App Component ---
const App = () => {
  // --- Auth Store State & Actions ---
  const { token, isLoggedIn, login } = authStore();

  // --- Effect: Auto-login if token exists ---
  useEffect(() => {
    if (token) login(token);
  }, [token, login]);

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      {/* --- Toast Notifications --- */}
      <Toaster position="top-center" />

      {/* --- Main Content Area --- */}
      <main
        className={`flex-1 ${!isLoggedIn ? "flex items-center justify-center" : ""
          }`}
      >
        {/* --- App Routes --- */}
        <Routes>
          {/* Home Page (protected) */}
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
            }
          />
          {/* Login Page (redirect if logged in) */}
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <LoginPage onLogin={login} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Register Page (redirect if logged in) */}
          <Route
            path="/register"
            element={
              !isLoggedIn ? <RegisterPage /> : <Navigate to="/" replace />
            }
          />
          {/* Catch-all: Redirect based on auth status */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

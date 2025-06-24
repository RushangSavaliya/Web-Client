// File: src/App.jsx

// --- Imports ---
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import authStore from "./store/auth.store";

// --- App Component ---
const App = () => {
  // --- Auth Store State ---
  const { token, isLoggedIn, login, logout } = authStore();

  // --- Effect: Auto-login if token exists ---
  useEffect(() => {
    if (token) login(token);
  }, [token, login]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* --- Toast Notifications --- */}
      <Toaster position="top-center" />

      {/* --- Navbar (only when logged in) --- */}
      {isLoggedIn && (
        <Navbar
          isLoggedIn={isLoggedIn}
          user={authStore.getState().user}
          onLogout={logout}
        />
      )}

      {/* --- Main Content & Routing --- */}
      <main className={isLoggedIn ? "" : "min-h-screen"}>
        <Routes>
          {/* --- Home Route (protected) --- */}
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
            }
          />
          {/* --- Login Route --- */}
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
          {/* --- Register Route --- */}
          <Route
            path="/register"
            element={
              !isLoggedIn ? <RegisterPage /> : <Navigate to="/" replace />
            }
          />
          {/* --- Catch-all Route --- */}
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

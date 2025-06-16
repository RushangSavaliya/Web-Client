// File: src/App.jsx

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import authStore from "./store/auth.store";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const { token, isLoggedIn, login, logout } = authStore();

  useEffect(() => {
    if (token) login(token);
  }, [token, login]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage onLogin={login} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
};

export default App;

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/chat/HomePage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import authStore from "./store/auth.store";

const App = () => {
  const { token, isLoggedIn, login, initializeSocket } = authStore();

  useEffect(() => {
    if (token) {
      login(token);
    }
    initializeSocket();
  }, [token, login, initializeSocket]);

  return (
    <div className="app">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: '14px',
          },
        }}
      />

      {isLoggedIn ? (
        <HomePage />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;

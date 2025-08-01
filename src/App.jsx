import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/chat/HomePage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import authStore from "./store/auth.store";

const App = () => {
  const { token, isLoggedIn, login } = authStore();

  useEffect(() => {
    if (token) login(token);
  }, [token, login]);

  return (
    <div className="app">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />

      <main className={!isLoggedIn ? "flex items-center justify-center min-h-screen" : "flex-1"}>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginPage onLogin={login} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" replace />}
          />
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

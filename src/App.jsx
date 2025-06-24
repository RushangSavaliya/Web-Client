import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
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
    <div className="min-h-screen bg-base-100">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            border: "1px solid hsl(var(--b3))",
          },
          success: {
            iconTheme: {
              primary: "hsl(var(--su))",
              secondary: "hsl(var(--suc))",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(var(--er))",
              secondary: "hsl(var(--erc))",
            },
          },
        }}
      />

      {/* Navigation - Only show for authenticated users */}
      {isLoggedIn && (
        <Navbar
          isLoggedIn={isLoggedIn}
          user={authStore.getState().user}
          onLogout={logout}
        />
      )}

      {/* Main Content */}
      <main className={isLoggedIn ? "" : "min-h-screen"}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
            }
          />
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
          <Route
            path="/register"
            element={
              !isLoggedIn ? <RegisterPage /> : <Navigate to="/" replace />
            }
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

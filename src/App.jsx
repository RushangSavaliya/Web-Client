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
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            border: "1px solid hsl(var(--b3))",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            minWidth: "280px",
            maxWidth: "90vw",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
          },
          success: {
            style: {
              background: "hsl(var(--su))",
              color: "hsl(var(--suc))",
              border: "1px solid hsl(var(--su))",
            },
            iconTheme: {
              primary: "hsl(var(--suc))",
              secondary: "hsl(var(--su))",
            },
          },
          error: {
            style: {
              background: "hsl(var(--er))",
              color: "hsl(var(--erc))",
              border: "1px solid hsl(var(--er))",
            },
            iconTheme: {
              primary: "hsl(var(--erc))",
              secondary: "hsl(var(--er))",
            },
          },
          loading: {
            style: {
              background: "hsl(var(--b1))",
              color: "hsl(var(--bc))",
              border: "1px solid hsl(var(--b3))",
            },
          },
        }}
        containerStyle={{
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
        containerClassName="toast-container"
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

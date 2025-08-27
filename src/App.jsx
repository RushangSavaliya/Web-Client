// File: src/App.jsx

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/chat/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import authStore from "./store/authStore";

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
                <Home />
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    <Routes>
                        <Route path="/login" element={<Login onLogin={login} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            )}
        </div>
    );
};

export default App;

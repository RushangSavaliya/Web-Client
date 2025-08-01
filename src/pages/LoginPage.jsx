// File: src/pages/LoginPage.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

/**
 * LoginPage - Handles user authentication
 */
function LoginPage({ onLogin }) {
  // -------------------------------
  // State Management
  // -------------------------------
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------------------
  // Refs & Router
  // -------------------------------
  const identifierRef = useRef(null);
  const navigate = useNavigate();

  // -------------------------------
  // Effects
  // -------------------------------
  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  // -------------------------------
  // Validation
  // -------------------------------
  const validate = useCallback(() => {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Required";
    if (!form.password) errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // -------------------------------
  // Input Change Handler
  // -------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // -------------------------------
  // Form Submit Handler
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", {
        usernameORemail: form.identifier,
        password: form.password,
      });

      const success = await onLogin(res.data.token);
      if (success) navigate("/");
      else toast.error("Session validation failed");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // UI Rendering
  // -------------------------------
  return (
    <div className="min-h-screen bg-telegram-primary flex flex-col">
      {/* --------- Main Content --------- */}
      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <section className="w-full max-w-lg md:max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-xl flex items-center justify-center shadow-sm" style={{backgroundColor: 'var(--color-primary)', color: 'white'}}>
              <FaComments className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-medium leading-tight">
              Access your account
            </h1>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="form-container rounded-xl px-6 md:px-8 py-6 md:py-8 shadow-sm space-y-5 md:space-y-6">
          >
            {/* Identifier Field */}
            <label className="floating-label validator w-full">
              <input
                ref={identifierRef}
                type="text"
                name="identifier"
                className={`input ${errors.identifier ? "input-error" : ""}`}
                placeholder="Username or Email"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
              <span>Email or Username</span>
              {errors.identifier && (
                <p className="validator-hint">{errors.identifier}</p>
              )}
            </label>

            {/* Password Field */}
            <label className="floating-label validator w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`input pr-10 ${errors.password ? "input-error" : ""}`}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span>Password</span>

              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-telegram-muted hover:text-telegram-primary"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>

              {errors.password && (
                <p className="validator-hint">{errors.password}</p>
              )}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || !form.identifier || !form.password}
            >
              {loading ? (
                <div className="loading-spinner w-4 h-4" />
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm">
              No account?{" "}
              <Link to="/register" className="link font-medium">
                Register
              </Link>
            </p>
          </form>
        </section>
      </main>

      {/* --------- Footer --------- */}
      <Footer />
    </div>
  );
}

export default LoginPage;

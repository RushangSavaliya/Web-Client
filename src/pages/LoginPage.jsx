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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* --------- Main Content --------- */}
      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <section className="w-full max-w-lg md:max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
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
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-6 md:px-8 py-6 md:py-8 shadow-sm space-y-5 md:space-y-6"
          >
            {/* Identifier Field */}
            <label className="floating-label validator w-full">
              <input
                ref={identifierRef}
                type="text"
                name="identifier"
                className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors ${errors.identifier ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400`}
                placeholder="Username or Email"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
              <span>Email or Username</span>
              {errors.identifier && (
                <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>
              )}
            </label>

            {/* Password Field */}
            <label className="floating-label validator w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400`}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span>Password</span>

              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={loading || !form.identifier || !form.password}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm">
              No account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
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

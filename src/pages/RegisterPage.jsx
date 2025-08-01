// File: src/pages/RegisterPage.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

/**
 * RegisterPage - Handles user registration UI and logic
 */
function RegisterPage() {
  // -------------------------------
  // State Management
  // -------------------------------
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Refs & Router
  // -------------------------------
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // -------------------------------
  // Effects
  // -------------------------------
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // -------------------------------
  // Form Validation
  // -------------------------------
  const validate = useCallback(() => {
    const errs = {};
    const { username, email, password } = form;

    // Username validation
    if (!username.trim()) errs.username = "Required";
    else if (username.length < 3 || username.length > 20) errs.username = "3-20 characters";

    // Email validation
    if (!email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";

    // Password validation
    if (!password) errs.password = "Required";
    else if (password.length < 8) errs.password = "Min 8 characters";

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
      await axiosInstance.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
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
            <h1 className="text-xl md:text-2xl font-medium leading-tight">Create account</h1>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-6 md:px-8 py-6 md:py-8 shadow-sm space-y-5 md:space-y-6"
          >
            {/* Username Field */}
            <label className="floating-label validator w-full">
              <input
                ref={usernameRef}
                type="text"
                name="username"
                className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors ${errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400`}
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
              <span>Username</span>
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </label>

            {/* Email Field */}
            <label className="floating-label validator w-full">
              <input
                type="email"
                name="email"
                className={`w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400`}
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <span>Email</span>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                autoComplete="new-password"
              />
              <span>Password</span>

              {/* Toggle password visibility */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>

              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              disabled={loading || !form.username || !form.email || !form.password}
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Register"}
            </button>

            {/* Login Redirect */}
            <p className="text-center text-sm">
              Have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">Login</Link>
            </p>
          </form>
        </section>
      </main>

      {/* --------- Footer --------- */}
      <Footer />
    </div>
  );
}

export default RegisterPage;

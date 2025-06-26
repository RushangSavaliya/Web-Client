// File: src/pages/LoginPage.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

// =====================
// RegisterPage Component
// =====================
function RegisterPage() {
  // ---------------------
  // State and Refs
  // ---------------------
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // ---------------------
  // Focus username input on mount
  // ---------------------
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // ---------------------
  // Form Validation
  // ---------------------
  const validate = useCallback(() => {
    const errs = {};
    const { username, email, password } = form;
    if (!username.trim()) errs.username = "Username is required";
    else if (username.length < 3 || username.length > 20)
      errs.username = "Username must be 3-20 characters";
    if (!email.trim()) errs.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errs.email = "Invalid email address";
    }
    if (!password) errs.password = "Password is required";
    else if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // ---------------------
  // Handle Input Change
  // ---------------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // ---------------------
  // Handle Form Submit
  // ---------------------
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      if (!validate()) return;
      setLoading(true);
      try {
        await axiosInstance.post("/auth/register", form);
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.error || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
    [form, loading, navigate, validate]
  );

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-2 py-8">
        <section className="w-full max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-3xl shadow-lg">
              <FaComments className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Create your account
            </h1>
            <p className="text-base text-base-content/60">
              Join the conversation now
            </p>
          </div>
          {/* Registration Form */}
          <form
            className="bg-base-100 border border-base-300 rounded-2xl p-8 shadow-xl space-y-6"
            onSubmit={handleSubmit}
            autoComplete="on"
            aria-label="Register form"
          >
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block font-semibold mb-1">
                Username
              </label>
              <input
                ref={usernameRef}
                type="text"
                id="username"
                name="username"
                className={`input input-bordered w-full ${
                  errors.username ? "input-error" : ""
                }`}
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Enter your username"
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
              />
              {errors.username && (
                <span
                  id="username-error"
                  className="text-error text-xs mt-1 block"
                  role="alert"
                >
                  {errors.username}
                </span>
              )}
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span
                  id="email-error"
                  className="text-error text-xs mt-1 block"
                  role="alert"
                >
                  {errors.email}
                </span>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`input input-bordered w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span
                  id="password-error"
                  className="text-error text-xs mt-1 block"
                  role="alert"
                >
                  {errors.password}
                </span>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={
                loading || !form.username || !form.email || !form.password
              }
              aria-busy={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Register"
              )}
            </button>
            {/* Login Link */}
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-hover text-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RegisterPage;

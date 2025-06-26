// File: src/pages/LoginPage.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

// =======================
// LoginPage Component
// =======================
function LoginPage({ onLogin }) {
  // -----------------------
  // State and Refs
  // -----------------------
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const identifierRef = useRef(null);
  const navigate = useNavigate();

  // -----------------------
  // Focus identifier input on mount
  // -----------------------
  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  // -----------------------
  // Form Validation
  // -----------------------
  const validate = useCallback(() => {
    const errs = {};
    if (!form.identifier.trim())
      errs.identifier = "Email or username is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // -----------------------
  // Handle Input Change
  // -----------------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // -----------------------
  // Handle Form Submit
  // -----------------------
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      if (!validate()) return;
      setLoading(true);
      try {
        const res = await axiosInstance.post("/auth/login", {
          usernameORemail: form.identifier,
          password: form.password,
        });
        const { token } = res.data;
        if (token) {
          const success = await onLogin(token);
          if (success) {
            navigate("/");
          } else {
            toast.error("Session validation failed");
          }
        } else {
          toast.error("Login failed: Token missing");
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [form, loading, navigate, onLogin, validate]
  );

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-2 py-8">
        <section className="w-full max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg"
              aria-label="App logo"
            >
              <FaComments className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Welcome back
            </h1>
            <p className="text-base text-base-content/60">
              Sign in to your account
            </p>
          </div>
          {/* Login Form */}
          <form
            className="bg-base-100 border border-base-300 rounded-2xl p-8 shadow-xl space-y-6"
            onSubmit={handleSubmit}
            autoComplete="on"
            aria-label="Login form"
          >
            {/* Identifier Field */}
            <div>
              <label
                htmlFor="identifier"
                className="block font-semibold text-base-content mb-1"
              >
                Email or Username
              </label>
              <input
                ref={identifierRef}
                type="text"
                id="identifier"
                name="identifier"
                className={`input input-bordered w-full ${
                  errors.identifier ? "input-error" : ""
                }`}
                value={form.identifier}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Enter your email or username"
                aria-invalid={!!errors.identifier}
                aria-describedby={
                  errors.identifier ? "identifier-error" : undefined
                }
              />
              {errors.identifier && (
                <span
                  id="identifier-error"
                  className="text-error text-xs mt-1 block"
                  role="alert"
                >
                  {errors.identifier}
                </span>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block font-semibold text-base-content mb-1"
              >
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-base-content/60 hover:text-base-content focus:outline-none"
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
              disabled={loading || !form.identifier || !form.password}
              aria-busy={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
            {/* Register Link */}
            <p className="text-center text-sm mt-2">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="link link-hover text-primary font-semibold"
              >
                Register
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

export default LoginPage;

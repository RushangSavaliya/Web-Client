// File: src/pages/LoginPage.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

/**
 * LoginPage component handles user authentication.
 */
function LoginPage({ onLogin }) {
  // -------------------- State & Refs --------------------
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const identifierRef = useRef(null);
  const navigate = useNavigate();

  // -------------------- Effects --------------------
  // Focus on identifier input on mount
  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  // -------------------- Validation --------------------
  const validate = useCallback(() => {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Required";
    if (!form.password) errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // -------------------- Handlers --------------------
  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading || !validate()) return;
      setLoading(true);
      try {
        // Attempt login
        const res = await axiosInstance.post("/auth/login", {
          usernameORemail: form.identifier,
          password: form.password,
        });
        // Pass token to parent
        const success = await onLogin(res.data.token);
        if (success) navigate("/");
        else toast.error("Session validation failed");
      } catch (err) {
        toast.error(err.response?.data?.error || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [form, loading, navigate, onLogin, validate]
  );

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <section className="w-full max-w-lg md:max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-sm">
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
            className="bg-base-100 border border-base-300 rounded-xl px-6 md:px-8 py-6 md:py-8 shadow-sm space-y-5 md:space-y-6"
          >
            {/* Identifier Field */}
            <label className="floating-label validator w-full">
              <input
                ref={identifierRef}
                type="text"
                name="identifier"
                className={`input input-bordered input-md w-full ${errors.identifier ? "input-error" : ""}`}
                placeholder="Username or Email"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
              <span>Email or Username</span>
              {errors.identifier && (
                <p className="validator-hint text-error">{errors.identifier}</p>
              )}
            </label>

            {/* Password Field */}
            <label className="floating-label validator w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`input input-bordered input-md w-full pr-10 ${errors.password ? "input-error" : ""}`}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span>Password</span>
              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
              {errors.password && (
                <p className="validator-hint text-error">{errors.password}</p>
              )}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-md btn-primary w-full"
              disabled={loading || !form.identifier || !form.password}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm">
              No account?{" "}
              <Link to="/register" className="link text-primary font-medium">
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


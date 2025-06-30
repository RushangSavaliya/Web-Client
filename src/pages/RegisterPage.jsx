// File: src/pages/RegisterPage.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axiosInstance from "../lib/axios";

/**
 * RegisterPage - User registration form page
 */
function RegisterPage() {
  // --- State ---
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Refs & Navigation ---
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // --- Effects ---
  // Autofocus username input on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // --- Validation ---
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

  // --- Handlers ---
  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [form, loading, navigate, validate]
  );

  // --- Render ---
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
            <h1 className="text-xl md:text-2xl font-medium leading-tight">Create account</h1>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="bg-base-100 border border-base-300 rounded-xl px-6 md:px-8 py-6 md:py-8 shadow-sm space-y-5 md:space-y-6"
          >
            {/* Username Field */}
            <label className="floating-label validator w-full">
              <input
                ref={usernameRef}
                type="text"
                name="username"
                className={`input input-bordered input-md w-full ${errors.username ? "input-error" : ""}`}
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
              <span>Username</span>
              {errors.username && <p className="validator-hint text-error">{errors.username}</p>}
            </label>

            {/* Email Field */}
            <label className="floating-label validator w-full">
              <input
                type="email"
                name="email"
                className={`input input-bordered input-md w-full ${errors.email ? "input-error" : ""}`}
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <span>Email</span>
              {errors.email && <p className="validator-hint text-error">{errors.email}</p>}
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
                autoComplete="new-password"
              />
              <span>Password</span>
              {/* Toggle password visibility */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
              {errors.password && <p className="validator-hint text-error">{errors.password}</p>}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-md btn-primary w-full"
              disabled={loading || !form.username || !form.email || !form.password}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm">
              Have an account?{" "}
              <Link to="/login" className="link text-primary font-medium">Login</Link>
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


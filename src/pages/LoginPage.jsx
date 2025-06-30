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
  // State for form fields
  const [form, setForm] = useState({ identifier: "", password: "" });
  // Loading state for submit button
  const [loading, setLoading] = useState(false);
  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Validation errors
  const [errors, setErrors] = useState({});
  // Ref for focusing identifier input
  const identifierRef = useRef(null);
  // Router navigation
  const navigate = useNavigate();

  // Focus identifier input on mount
  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  /**
   * Validate form fields.
   */
  const validate = useCallback(() => {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Required";
    if (!form.password) errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  /**
   * Handle input changes.
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  /**
   * Handle form submission.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading || !validate()) return;
      setLoading(true);
      try {
        // API call to login
        const res = await axiosInstance.post("/auth/login", {
          usernameORemail: form.identifier,
          password: form.password,
        });
        const { token } = res.data;
        const success = await onLogin(token);
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

  // --- Render ---

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center px-4 py-10">
        <section className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow">
              <FaComments className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
            <p className="text-sm md:text-base text-base-content/60">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="w-full bg-base-100 border border-base-300 rounded-xl p-4 sm:p-6 shadow space-y-4"
          >
            {/* Identifier Field */}
            <div className="w-full">
              <label htmlFor="identifier" className="label-text text-sm">
                Email or Username
              </label>
              <input
                ref={identifierRef}
                type="text"
                id="identifier"
                name="identifier"
                className={`input input-sm input-bordered w-full ${errors.identifier ? "input-error" : ""}`}
                value={form.identifier}
                onChange={handleChange}
                placeholder="username or email"
                autoComplete="username"
              />
              {errors.identifier && (
                <p className="text-error text-xs mt-1">{errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full">
              <label htmlFor="password" className="label-text text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`input input-sm input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="password"
                  autoComplete="current-password"
                />
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-sm md:btn-md btn-primary w-full"
              disabled={loading || !form.identifier || !form.password}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="link link-hover text-primary font-semibold">
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


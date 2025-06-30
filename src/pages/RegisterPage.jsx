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
  // -------------------- State & Refs --------------------
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  // -------------------- Effects --------------------
  // Autofocus username input on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // -------------------- Validation --------------------
  /**
   * Validates form fields and sets error messages
   * @returns {boolean} true if valid, false otherwise
   */
  const validate = useCallback(() => {
    const errs = {};
    const { username, email, password } = form;

    // Username validation
    if (!username.trim()) errs.username = "Required";
    else if (username.length < 3 || username.length > 20)
      errs.username = "3-20 characters";

    // Email validation
    if (!email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email";

    // Password validation
    if (!password) errs.password = "Required";
    else if (password.length < 8) errs.password = "Min 8 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  // -------------------- Handlers --------------------
  /**
   * Handles input changes and clears field errors
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  /**
   * Handles form submission
   */
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

  // -------------------- Render --------------------
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
            <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>
            <p className="text-sm md:text-base text-base-content/60">
              Join the conversation
            </p>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="w-full bg-base-100 border border-base-300 rounded-xl p-4 sm:p-6 shadow space-y-4"
          >
            {/* Username Field */}
            <div className="w-full">
              <label htmlFor="username" className="label-text text-sm">
                Username
              </label>
              <input
                ref={usernameRef}
                type="text"
                id="username"
                name="username"
                className={`input input-sm input-bordered w-full ${errors.username ? "input-error" : ""}`}
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-error text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="w-full">
              <label htmlFor="email" className="label-text text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input input-sm input-bordered w-full ${errors.email ? "input-error" : ""}`}
                value={form.email}
                onChange={handleChange}
                placeholder="email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
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
                  autoComplete="new-password"
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
              disabled={
                loading || !form.username || !form.email || !form.password
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Register"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-hover text-primary font-semibold">
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


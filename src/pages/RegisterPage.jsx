import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { username, email, password } = form;

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      form.username.trim().length >= 3 &&
      form.username.trim().length <= 20 &&
      /^[a-zA-Z0-9_]+$/.test(form.username.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.password.trim().length >= 8
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-primary text-primary-content flex items-center justify-center text-lg sm:text-xl md:text-2xl">
            💬
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-base-content mb-1 sm:mb-2">
            Create account
          </h1>
          <p className="text-sm sm:text-base text-base-content/60">
            Join ChatApp today
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-base-100 border border-base-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Username Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base pr-10 sm:pr-12"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.121 15.12m0 0l4.243 4.242M15.121 15.12L19.364 19.364"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="btn btn-primary w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-medium mt-6 sm:mt-8"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-base-content/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-focus transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

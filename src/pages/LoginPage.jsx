import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ usernameORemail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const { usernameORemail, password } = form;

    // Client-side validation
    if (!usernameORemail.trim()) {
      toast.error("Please enter your email or username");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        usernameORemail: usernameORemail.trim(),
        password,
      });

      const { token } = res.data;

      if (token) {
        const success = await onLogin(token);
        if (success) {
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error("Session validation failed. Please try again.");
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl">
            💬
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-base-content mb-2">
            Welcome back
          </h1>
          <p className="text-base-content/60">
            Sign in to your ChatApp account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text text-sm font-medium text-base-content">
                  Email or Username
                </span>
              </label>
              <input
                type="text"
                name="usernameORemail"
                className="input input-bordered w-full h-12 text-base"
                placeholder="Enter your email or username"
                value={form.usernameORemail}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text text-sm font-medium text-base-content">
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full h-12 text-base pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
              disabled={
                loading || !form.usernameORemail.trim() || !form.password.trim()
              }
              className="btn btn-primary w-full h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-base-content/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-focus transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Footer from "../components/Footer";

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
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-primary text-primary-content flex items-center justify-center text-lg sm:text-xl md:text-2xl">
            💬
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-base-content mb-1 sm:mb-2">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-base-content/60">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-base-100 border border-base-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Email/Username Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">
                Email or Username
              </label>
              <input
                type="text"
                name="usernameORemail"
                className="input input-bordered w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                value={form.usernameORemail}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
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
              className="btn btn-primary w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-medium mt-6 sm:mt-8"
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

        {/* Navigation */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-base-content/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-focus transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default LoginPage;

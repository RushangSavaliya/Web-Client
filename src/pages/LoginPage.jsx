// File: src/pages/LoginPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "../lib/axios";

function LoginPage({ onLogin }) {
  // --- States ---
  const [form, setForm] = useState({ usernameORemail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // --- End States ---

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const { usernameORemail, password } = form;

    if (!usernameORemail.trim()) {
      errors.usernameORemail = "Email or username is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) {
      toast.error("Please check the form for errors");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", form);
      const { token } = res.data;

      if (token) {
        const success = await onLogin(token);
        if (success) {
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error("Session validation failed");
          setLoading(false);
        }
      } else {
        toast.error("Login failed: Token missing");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.3"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
        }
      ></div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative">
          {/* Decorative Element */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-4 shadow-lg">
              <MessageCircle size={24} className="text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center pt-6 pb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Input */}
            <div className="form-field">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="usernameORemail"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    formErrors.usernameORemail
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                  }`}
                  placeholder="Enter your email or username"
                  value={form.usernameORemail}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.usernameORemail && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.usernameORemail}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="form-field">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    formErrors.password
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                  }`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          Secure login powered by modern encryption
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

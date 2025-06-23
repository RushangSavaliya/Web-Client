// File: src/pages/RegisterPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";
import axiosInstance from "../lib/axios";

function RegisterPage() {
  // --- States Section ---
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  // --- End States Section ---

  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const errors = {};
    const { username, email, password } = form;

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3 || username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      await axiosInstance.post("/auth/register", form);
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Medium";
    if (passwordStrength >= 25) return "Weak";
    return "Very Weak";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d1fae5" fill-opacity="0.4"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
        }
      ></div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative">
          {/* Decorative Element */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full p-4 shadow-lg">
              <UserPlus size={24} className="text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center pt-6 pb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Join ChatApp
            </h1>
            <p className="text-slate-600 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="form-field">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    formErrors.username
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-slate-200 focus:border-emerald-500 focus:bg-white"
                  }`}
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.username}
                </p>
              )}
              {!formErrors.username && form.username && (
                <p className="mt-2 text-sm text-slate-500">3-20 characters</p>
              )}
            </div>

            {/* Email Input */}
            <div className="form-field">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    formErrors.email
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-slate-200 focus:border-emerald-500 focus:bg-white"
                  }`}
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
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
                      : "border-slate-200 focus:border-emerald-500 focus:bg-white"
                  }`}
                  placeholder="Create a secure password"
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

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength >= 75
                          ? "text-green-600"
                          : passwordStrength >= 50
                            ? "text-yellow-600"
                            : passwordStrength >= 25
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center space-x-2 text-slate-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                Your data is protected with end-to-end encryption
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          Join thousands of users worldwide
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

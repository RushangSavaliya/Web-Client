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
  MessageCircle,
  UserPlus,
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
  // --- End States Section ---

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

    // Client-side validation
    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
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
      setLoading(false); // allow retry on failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/20 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="card w-full max-w-md bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300/50">
        <div className="card-body p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-secondary to-accent text-secondary-content rounded-full w-16">
                <UserPlus size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Join ChatApp
            </h1>
            <p className="text-base-content/70">
              Create your account to get started
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  className="input input-bordered w-full pl-12 pr-4 focus:input-secondary"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  size={18}
                />
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  3-20 characters
                </span>
              </label>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-12 pr-4 focus:input-secondary"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  size={18}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-12 pr-12 focus:input-secondary"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  size={18}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Minimum 8 characters
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`btn btn-secondary w-full mt-6 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">or</div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-secondary font-medium hover:link-hover"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

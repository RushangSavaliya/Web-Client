// File: src/pages/LoginPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, MessageCircle } from "lucide-react";
import axiosInstance from "../lib/axios";

function LoginPage({ onLogin }) {
  // --- States ---
  const [form, setForm] = useState({ usernameORemail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // --- End States ---

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit
    setLoading(true);

    const { usernameORemail, password } = form;
    if (!usernameORemail || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", form);
      const { token } = res.data;

      if (token) {
        const success = await onLogin(token);
        if (success) {
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
      setLoading(false); // allow retry
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="card w-full max-w-md bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300/50">
        <div className="card-body p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-full w-16">
                <MessageCircle size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base-content/70">
              Sign in to continue to ChatApp
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email/Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Email or Username
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="usernameORemail"
                  className="input input-bordered w-full pl-12 pr-4 focus:input-primary"
                  placeholder="Enter your email or username"
                  value={form.usernameORemail}
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
                  className="input input-bordered w-full pl-12 pr-12 focus:input-primary"
                  placeholder="Enter your password"
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full mt-6 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">or</div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-base-content/70">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="link link-primary font-medium hover:link-hover"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

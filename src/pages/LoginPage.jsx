// File: src/pages/LoginPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-base-200/30 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="card bg-base-100/95 backdrop-blur-xl shadow-2xl border border-base-300/50">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Login
              </h1>
              <p className="text-base-content/70">
                Sign in to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Email or Username
                  </span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 text-xl" />
                  <input
                    type="text"
                    name="usernameORemail"
                    className={`input input-bordered w-full pl-12 pr-4 focus:input-primary ${
                      formErrors.usernameORemail ? "input-error" : ""
                    }`}
                    placeholder="Enter your email or username"
                    value={form.usernameORemail}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formErrors.usernameORemail && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.usernameORemail}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative">
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`input input-bordered w-full pl-12 pr-12 focus:input-primary ${
                      formErrors.password ? "input-error" : ""
                    }`}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-xl" />
                    ) : (
                      <MdVisibility className="text-xl" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.password}
                    </span>
                  </label>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg font-semibold group"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <BsArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-8">or</div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-base-content/70">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="link link-primary font-semibold hover:link-hover"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="badge badge-outline badge-lg">
            <span className="text-base-content/60">
              Secure login with modern encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// File: src/pages/RegisterPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { IoPersonAddOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";
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
    if (passwordStrength >= 75) return "progress-success";
    if (passwordStrength >= 50) return "progress-warning";
    if (passwordStrength >= 25) return "progress-info";
    return "progress-error";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Medium";
    if (passwordStrength >= 25) return "Weak";
    return "Very Weak";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-accent/5 to-info/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-base-200/30 bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.1),transparent_50%)]"></div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="card bg-base-100/95 backdrop-blur-xl shadow-2xl border border-base-300/50">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
                Register
              </h1>
              <p className="text-base-content/70">
                Create your account to get started
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Username</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 text-xl" />
                  <input
                    type="text"
                    name="username"
                    className={`input input-bordered w-full pl-12 pr-4 focus:input-secondary ${
                      formErrors.username ? "input-error" : ""
                    }`}
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formErrors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.username}
                    </span>
                  </label>
                )}
                {!formErrors.username && form.username && (
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      3-20 characters
                    </span>
                  </label>
                )}
              </div>

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 text-xl" />
                  <input
                    type="email"
                    name="email"
                    className={`input input-bordered w-full pl-12 pr-4 focus:input-secondary ${
                      formErrors.email ? "input-error" : ""
                    }`}
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {formErrors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.email}
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
                    className={`input input-bordered w-full pl-12 pr-12 focus:input-secondary ${
                      formErrors.password ? "input-error" : ""
                    }`}
                    placeholder="Create a secure password"
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

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-secondary w-full text-lg font-semibold group"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <BsArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-8">or</div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="link link-secondary font-semibold hover:link-hover"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
